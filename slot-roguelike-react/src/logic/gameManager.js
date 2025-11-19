import Player from './player.js';
import Monster from './monster.js';
import Item from './item.js';
import SlotMachine from './slotMachine.js';
import { monsters, equipmentMap, equipment, bosses } from './data.js';

class GameManager {
    constructor() {
        this.item = new Item();
        this.player = new Player();
        this.slotMachine = new SlotMachine(this.player); 
        this.allEquipment = equipment; 
        this.currentMonster = null; 
        this.stage = 1;
        this.gameState = 'InitialSetup'; 
        this.shopInventory = [];
        
        this.loadProgress();
    }
    
    loadProgress() {
        const savedLevel = localStorage.getItem('playerLevel');
        const savedExp = localStorage.getItem('playerExp');
        
        this.playerLevel = savedLevel ? parseInt(savedLevel) : 0;
        this.playerExp = savedExp ? parseInt(savedExp) : 0;
        
        this.unlockWeaponsByLevel();
    }
    
    saveProgress() {
        localStorage.setItem('playerLevel', this.playerLevel.toString());
        localStorage.setItem('playerExp', this.playerExp.toString());
    }
    
    unlockWeaponsByLevel() {
        this.allEquipment.forEach(item => {
            if (item.requiredLevel <= this.playerLevel) {
                item.unlocked = true;
            }
        });
    }
    
    gainExperience(expAmount) {
        this.playerExp += expAmount;
        const newLevel = Math.floor(this.playerExp / 100);
        
        if (newLevel > this.playerLevel) {
            this.playerLevel = newLevel;
            this.unlockWeaponsByLevel();
        }
        
        this.saveProgress();
    }

    generateShopInventory() {
        const currentLevel = Math.ceil(this.stage / 10);
        
        let availableWeapons = this.allEquipment.filter(item => {
            if (item.cost === 0) return false;
            if (this.player.equippedWeapons.includes(item.id)) return false;
            if (item.requiredLevel <= currentLevel || currentLevel === 0) return true;
            return false;
        });
        
        let shuffledWeapons = [...availableWeapons]
            .sort(() => 0.5 - Math.random());
        
        this.shopInventory = shuffledWeapons.slice(0, 4);
        return this.shopInventory;
    }

    calculateMultiplier(resultArray) {
        let comboCheck = 0;
        
        for(let i = 0; i < resultArray.length - 1; i++) {
            if(resultArray[i].type === resultArray[i+1].type) { 
                comboCheck++;
                if(comboCheck >= 2) {
                    return 3.0; 
                }
            } else {
                comboCheck = 0;
            }
        }
        
        return 1.0;
    }

    processSingleSlotResult(itemResult, multiplier) {
        if (itemResult.type !== 'Attack') {
            this.item.processSlotResult(
                [itemResult],
                this.currentMonster,
                this.player,
                multiplier
            );
            return {
                physicalDamage: 0,
                poisonDamage: 0,
                fireDamage: 0,
                iceDamage: 0,
                lightningDamage: 0,
                holyDamage: 0,
                darkDamage: 0,
                magicDamage: 0,
                defenseGain: itemResult.type === 'Defense' ? itemResult.base_value * multiplier : 0,
                goldGain: itemResult.type === 'Resource' ? itemResult.base_value * multiplier : 0
            };
        }
        
        const actionResult = this.item.processSlotResult(
            [itemResult],
            this.currentMonster,
            this.player,
            multiplier
        );
        
        return { 
            physicalDamage: actionResult.physicalDamage,
            poisonDamage: actionResult.poisonDamage,
            fireDamage: actionResult.fireDamage,
            iceDamage: actionResult.iceDamage,
            lightningDamage: actionResult.lightningDamage,
            holyDamage: actionResult.holyDamage,
            darkDamage: actionResult.darkDamage,
            magicDamage: actionResult.magicDamage,
            defenseGain: 0,
            goldGain: 0
        };
    }

    aliveChecked(monster) {
        if(monster.hp <= 0) {
            return true;
        }
        else return false;
    }

    setInitialWeapons(itemIds) {
        if (itemIds.length !== 3) {
            console.error("3개의 장비 ID가 필요합니다.");
            return;
        }

        this.player.equippedWeapons = itemIds; 
        this.prepareNextCombat(); 
        this.gameState = 'Combat';
    }
    
    handleMonsterDefeat() {
        if (!this.currentMonster || this.currentMonster.hp > 0) {
            console.error("ERROR: 몬스터가 살아있거나 존재하지 않습니다.");
            return;
        }

        const goldReward = this.currentMonster.goldReward || (100 + this.stage * 10);
        const expReward = this.currentMonster.expReward || 20;
        
        this.player.gold += goldReward;
        this.gainExperience(expReward);
        
        this.player.df = 0;
        
        this.stage++;
        this.gameState = 'ShopPhase';
        
        this.generateShopInventory();
        
        this.currentMonster = null; 
    }

    monsterAttack() { 
        let totalPoisonDamage = 0;
        let shieldAbsorbed = 0;

        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            totalPoisonDamage = this.currentMonster.processStatusEffects();

            if(this.aliveChecked(this.currentMonster)) {
                this.handleMonsterDefeat();
                return { status: 'win', damageTaken: 0, poisonDamage: totalPoisonDamage, shieldAbsorbed: 0 }; 
            }
        }
        
        const absorbedDamage = Math.min(this.currentMonster.atk, this.player.df);
        shieldAbsorbed = absorbedDamage;
        const actualDamage = this.player.takeDamage(this.currentMonster.atk);

        if (this.currentMonster.increaseAttack) { 
            this.currentMonster.increaseAttack(); 
        }
        
        if(this.player.hp <= 0) {
            this.gameState = 'GameOver';
            return { status: 'lose', damageTaken: actualDamage, poisonDamage: totalPoisonDamage, shieldAbsorbed };
        }

        return { status: 'continue', damageTaken: actualDamage, poisonDamage: totalPoisonDamage, shieldAbsorbed };
    }

    prepareNextCombat() {
        const currentChapter = Math.ceil(this.stage / 10);
        const stageInChapter = ((this.stage - 1) % 10) + 1;
        
        this.player.df = 0;
        
        if (stageInChapter === 10) {
            const boss = bosses.find(b => b.chapter === currentChapter);
            if (boss) {
                const scaledHp = boss.hp + (this.stage - 1) * 20;
                this.currentMonster = new Monster({...boss, hp: scaledHp, maxHp: scaledHp});
            } else {
                console.error(`챕터 ${currentChapter}의 보스를 찾을 수 없습니다!`);
                this.gameState = 'GameOver';
                return;
            }
        } else {
            const chapterMonsters = monsters.filter(m => m.chapter === currentChapter);
            if (chapterMonsters.length > 0) {
                const randomMonster = chapterMonsters[Math.floor(Math.random() * chapterMonsters.length)];
                const scaledHp = randomMonster.hp + (this.stage - 1) * 10;
                this.currentMonster = new Monster({...randomMonster, hp: scaledHp, maxHp: scaledHp});
            } else {
                const lastChapterMonsters = monsters.filter(m => m.chapter === 7);
                const randomMonster = lastChapterMonsters[Math.floor(Math.random() * lastChapterMonsters.length)];
                const scaledHp = randomMonster.hp + (this.stage - 1) * 10;
                this.currentMonster = new Monster({...randomMonster, hp: scaledHp, maxHp: scaledHp});
            }
        }
        
        this.gameState = 'Combat';
    }

    buyAndEquipWeapon(itemId) {
        const itemData = this.allEquipment.find(item => item.id === itemId);

        if (!itemData) {
            console.error(`ERROR: Item ID ${itemId} not found.`);
            return { success: false, message: '아이템을 찾을 수 없습니다.' };
        }
        
        if (this.player.equippedWeapons.includes(itemId)) {
            return { success: false, message: '이미 장착 중인 무기입니다.' };
        }
        
        if (this.player.gold < itemData.cost) {
            return { success: false, message: `골드가 부족합니다! (필요 골드: ${itemData.cost})` };
        }
        
        this.player.gold -= itemData.cost;
        this.player.equippedWeapons.push(itemId);
        
        this.shopInventory = this.shopInventory.filter(item => item.id !== itemId);
        
        return { success: true, message: `${itemData.name}을(를) 구매하고 장착했습니다.` };
    }

    sellWeapon(itemId) {
        const itemData = this.allEquipment.find(item => item.id === itemId);
        
        if (!itemData) {
            return { success: false, message: '아이템을 찾을 수 없습니다.' };
        }
        
        if (!this.player.equippedWeapons.includes(itemId)) {
            return { success: false, message: '장착하지 않은 무기입니다.' };
        }
        
        if (this.player.equippedWeapons.length <= 3) {
            return { success: false, message: '최소 3개의 무기는 장착해야 합니다!' };
        }
        
        const sellPrice = Math.floor(itemData.cost * 0.5);
        this.player.gold += sellPrice;
        this.player.equippedWeapons = this.player.equippedWeapons.filter(id => id !== itemId);
        
        if (this.player.weaponUpgradeLevels[itemId]) {
            delete this.player.weaponUpgradeLevels[itemId];
        }
        
        return { success: true, message: `${itemData.name}을(를) ${sellPrice} 골드에 판매했습니다.` };
    }

    upgradeWeapon(weaponId) {
        const weapon = this.allEquipment.find(w => w.id === weaponId);
        if (!weapon) {
            return { success: false, message: '무기를 찾을 수 없습니다.' };
        }
        
        const currentLevel = this.player.weaponUpgradeLevels[weaponId] || 0;
        const baseUpgradeCost = 100;
        const upgradeCost = baseUpgradeCost + (currentLevel * 75);
        
        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (필요: ${upgradeCost})` };
        }
        
        this.player.gold -= upgradeCost;
        this.player.weaponUpgradeLevels[weaponId] = currentLevel + 1;
        
        const statIncrease = Math.ceil(weapon.base_value * 0.15);
        weapon.base_value += statIncrease;
        
        return { 
            success: true, 
            message: `${weapon.name}이(가) Lv.${currentLevel + 1}로 업그레이드되었습니다! (+${statIncrease} 성능 증가)`,
            newLevel: currentLevel + 1,
            nextCost: baseUpgradeCost + ((currentLevel + 1) * 75)
        };
    }

    refreshShop(cost = 50) {
        if (this.player.gold < cost) {
            return { success: false, message: '골드가 부족합니다!' };
        }
        
        this.player.gold -= cost;
        this.generateShopInventory();
        
        return { success: true, message: '상점이 새로고침되었습니다!' };
    }
}

export default GameManager;