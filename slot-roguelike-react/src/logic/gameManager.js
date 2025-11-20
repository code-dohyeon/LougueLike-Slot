import Player from './player.js';
import Monster from './monster.js';
import Item from './item.js';
import SlotMachine from './slotMachine.js';
import { equipmentBackUp } from './data-backup.js';
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
        this.unlockedWeapons = [];
        
        this.loadProgress();
        this.restartGame();
    }
    
    loadProgress() {
        const savedLevel = localStorage.getItem('playerLevel');
        const savedExp = localStorage.getItem('playerExp');
        const unlockedWeapons = localStorage.getItem('unlockedWeapons');
        this.unlockedWeapons = unlockedWeapons ? JSON.parse(unlockedWeapons) : [];
        this.playerLevel = savedLevel ? parseInt(savedLevel) : 0;
        this.playerExp = savedExp ? parseInt(savedExp) : 0;

        // 모든 장비를 먼저 잠금 상태로 초기화
        this.allEquipment.forEach(item => {
            item.unlocked = false;
        });

        // 기본 무기 (requiredLevel === 0)는 항상 해금
        this.allEquipment.forEach(item => {
            if (item.requiredLevel === 0) {
                item.unlocked = true;
            }
        });

        // 해금된 무기만 unlocked = true로 설정
        this.unlockedWeapons.forEach(unlockedId => {
            const weapon = this.allEquipment.find(item => item.id === unlockedId);
            if(weapon) {
                weapon.unlocked = true;
            }
        });
        
        console.log('Loaded progress - Level:', this.playerLevel, 'EXP:', this.playerExp);
        console.log('Unlocked weapons:', this.allEquipment.filter(w => w.unlocked).map(w => w.name));
    }
    
    saveProgress() {
        if(localStorage !== undefined) {
            localStorage.setItem('playerLevel', this.playerLevel.toString());
            localStorage.setItem('playerExp', this.playerExp.toString());
            localStorage.setItem('unlockedWeapons', JSON.stringify(this.unlockedWeapons));
        }
        console.log("Saving Level:", this.playerLevel, "EXP:", this.playerExp, "Unlocked:", this.unlockedWeapons);
    }

    restartGame() {
        this.player = new Player();
        this.currentMonster = null;
        this.stage = 1;
        this.gameState = 'InitialSetup';
        this.shopInventory = [];
        
        // 재시작 시 allEquipment를 원본으로 완전히 초기화합니다.
        equipment.forEach(item => {
            if(item.requiredLevel !== 0)
            item.unlocked = false;
        });

        this.playerLevel = 0;
        this.playerExp = 0;
        this.unlockedWeapons = [];
        
        this.unlockWeaponsByLevel();

        this.saveProgress();
    }
    
    unlockWeaponsByLevel() {
        // console.log("Unlocking weapons for level:", this.playerLevel);
        const unlockedWeapons = this.unlockRandomWeapon(this.playerLevel);
        console.log(this.playerLevel + "레벨 달성! 무기 해금 시도 완료.");
        // 레벨업 시 해금된 무기 알림
        if (unlockedWeapons && unlockedWeapons.length > 0) {
            const weaponNames = unlockedWeapons.map(w => w.name).join(', ');
            console.log(`🎉 레벨 ${this.playerLevel} 달성! 해금된 무기: ${weaponNames}`);
        }
        
        this.saveProgress();
    }
    
    unlockRandomWeapon(level) {
        if (!this.allEquipment) {
            console.error("ERROR: No equipment data available.");
            return;
        }

        // 현재 레벨에서 해금 가능한 무기들 (아직 해금되지 않은 것만)
        const eligibleWeapons = this.allEquipment.filter(item => 
            item.requiredLevel === level && !item.unlocked && item.cost > 0
        );

        console.log("Eligible weapons for level", level, ":", eligibleWeapons.map(w => w.name));

        // 해금할 무기가 없으면 종료
        if (eligibleWeapons.length === 0) {
            console.log("No weapons to unlock at level", level);
            return;
        }

        // 최대 2개까지 랜덤 선택
        const weaponsToUnlock = Math.min(2, eligibleWeapons.length);
        const shuffled = [...eligibleWeapons].sort(() => 0.5 - Math.random());
        
        for(let i = 0; i < weaponsToUnlock; i++) {
            const weapon = shuffled[i];
            weapon.unlocked = true;
            
            // unlockedWeapons 배열에 추가 (중복 방지)
            if (!this.unlockedWeapons.includes(weapon.id)) {
                this.unlockedWeapons.push(weapon.id);
            }
            
            console.log(`Unlocked: ${weapon.name} (Level ${level})`);
        }
    }
    
    gainExperience(expAmount) {
        this.playerExp += expAmount;
        const newLevel = Math.floor(this.playerExp / 100);
        console.log("Gained EXP:", expAmount, "Total EXP:", this.playerExp, "New Level:", newLevel);
        
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
        
        // Attack 타입일 경우, 각 속성별로 개별 처리
        const damage = itemResult.base_value * multiplier;
        const result = {
            physicalDamage: 0,
            poisonDamage: 0,
            fireDamage: 0,
            iceDamage: 0,
            lightningDamage: 0,
            holyDamage: 0,
            darkDamage: 0,
            magicDamage: 0,
            defenseGain: 0,
            goldGain: 0
        };
        
        // 속성별로 몬스터에게 데미지 적용
        switch(itemResult.damage_type) {
            case 'Physical':
                result.physicalDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Poison':
                result.poisonDamage = damage;
                this.currentMonster.applyPoison(damage);
                break;
            case 'Fire':
                result.fireDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Ice':
                result.iceDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Lightning':
                result.lightningDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Holy':
                result.holyDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Dark':
                result.darkDamage = this.currentMonster.takeDamage(damage);
                break;
            case 'Magic':
                result.magicDamage = this.currentMonster.takeDamage(damage);
                break;
        }
        
        return result;
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
        
        // 스테이지 70 이상이면 엔딩
        if (this.stage > 70) {
            this.gameState = 'Ending';
        } else {
            this.gameState = 'ShopPhase';
            this.generateShopInventory();
        }
        
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
        const baseUpgradeCost = weapon.cost;
        const upgradeCost = baseUpgradeCost + (currentLevel * 75);
        
        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (필요: ${upgradeCost})` };
        }
        
        this.player.gold -= upgradeCost;
        this.player.weaponUpgradeLevels[weaponId] = currentLevel + 1;
        const statIncrease = 2;
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