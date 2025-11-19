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
        this.shopInventory = []; // 현재 상점 인벤토리
        
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
            console.log(`레벨업! 현재 레벨: ${this.playerLevel}`);
            this.unlockWeaponsByLevel();
        }
        
        this.saveProgress();
    }

    // [수정된 함수] 랜덤 상점 아이템 생성
    generateShopInventory() {
        // 현재 스테이지 기반으로 레벨 계산
        const currentLevel = Math.ceil(this.stage / 10);
        
        // 1. 구매 가능한 무기 풀 (현재 레벨 이하 + 장착 중이 아닌 무기)
        let availableWeapons = this.allEquipment.filter(item => {
            // 무료 아이템 제외
            if (item.cost === 0) return false;
            
            // 이미 장착한 무기 제외
            if (this.player.equippedWeapons.includes(item.id)) return false;
            
            // 현재 레벨 이하의 무기만 (해금 여부 무관)
            if(currentLevel === 0) {
                currentLevel = 1; return true;
            }

            if (item.requiredLevel <= currentLevel) return true;
            
            return false;
        });
        // 2. 무기 목록을 랜덤으로 섞기 (Fisher-Yates 셔플 등)
        let shuffledWeapons = [...availableWeapons]
            .sort(() => 0.5 - Math.random());
        
        // 3. 상점 인벤토리 구성: 앞에서 4개만 선택
        this.shopInventory = shuffledWeapons.slice(0, 4);
        
        console.log(`[상점] 스테이지 ${this.stage}, 레벨 ${currentLevel}, 무기 ${this.shopInventory.length}개 생성`);
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
        
        // 방어력 초기화
        this.player.df = 0;
        
        this.stage++;
        this.gameState = 'ShopPhase';
        
        // 상점 인벤토리 생성
        this.generateShopInventory();
        
        this.currentMonster = null; 
        
        console.log(`STAGE ${this.stage - 1} 클리어! 골드: +${goldReward}, 경험치: +${expReward}`);
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
        
        // 방어력 초기화
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
        
        // 상점 인벤토리에서 제거
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
            return { success: false, message: '최소3개의 무기는 장착해야 합니다!' };
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
        const upgradeCost = 100 + currentLevel * 50;
        
        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (필요: ${upgradeCost})` };
        }
        
        this.player.gold -= upgradeCost;
        this.player.weaponUpgradeLevels[weaponId] = currentLevel + 1;
        weapon.base_value += 5;
        
        return { 
            success: true, 
            message: `${weapon.name}이(가) Lv.${currentLevel + 1}로 업그레이드되었습니다! (+5 성능 증가)` 
        };
    }

    // 💡 몬스터 처치 후 상점 방문 시 자동으로 상점을 새로고침하는 함수 추가
    // (handleMonsterDefeat 내부에서 호출될 함수)
    refillShopInventory() {
        // 비용 없이 새로고침 (스테이지 클리어 보상으로 간주)
        const result = this.refreshShop(0); 
        if (!result.success) {
            console.error("상점 인벤토리 자동 채우기 실패");
        }
    }

    // 상점 새로고침 (골드 소모)
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