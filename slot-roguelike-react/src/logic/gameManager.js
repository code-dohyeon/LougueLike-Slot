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
        
        // 레벨업 체크 (10 스테이지 = 1 레벨)
        const newLevel = Math.floor(this.playerExp / 100); // 100 경험치당 1 레벨
        
        if (newLevel > this.playerLevel) {
            this.playerLevel = newLevel;
            console.log(`레벨업! 현재 레벨: ${this.playerLevel}`);
            this.unlockWeaponsByLevel();
        }
        
        this.saveProgress();
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
        // Attack 타입이 아니면 데미지 없음
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
                magicDamage: 0
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
            magicDamage: actionResult.magicDamage
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
        
        this.stage++;
        this.gameState = 'ShopPhase'; 
        this.currentMonster = null; 
        
        console.log(`STAGE ${this.stage - 1} 클리어! 골드: +${goldReward}, 경험치: +${expReward}`);
    }

    monsterAttack() { 
        let totalPoisonDamage = 0;

        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            totalPoisonDamage = this.currentMonster.processStatusEffects();

            if(this.aliveChecked(this.currentMonster)) {
                this.handleMonsterDefeat();
                return { status: 'win', damageTaken: 0, poisonDamage: totalPoisonDamage }; 
            }
        }
        
        const actualDamage = this.player.takeDamage(this.currentMonster.atk);

        if (this.currentMonster.increaseAttack) { 
            this.currentMonster.increaseAttack(); 
        }
        
        if(this.player.hp <= 0) {
            this.gameState = 'GameOver';
            return { status: 'lose', damageTaken: actualDamage, poisonDamage: totalPoisonDamage };
        }

        return { status: 'continue', damageTaken: actualDamage, poisonDamage: totalPoisonDamage };
    }

    prepareNextCombat() {
        const currentChapter = Math.ceil(this.stage / 10);
        const stageInChapter = ((this.stage - 1) % 10) + 1;
        
        // 10번째 스테이지는 보스
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
            // 일반 몬스터
            const chapterMonsters = monsters.filter(m => m.chapter === currentChapter);
            if (chapterMonsters.length > 0) {
                const randomMonster = chapterMonsters[Math.floor(Math.random() * chapterMonsters.length)];
                const scaledHp = randomMonster.hp + (this.stage - 1) * 10;
                this.currentMonster = new Monster({...randomMonster, hp: scaledHp, maxHp: scaledHp});
            } else {
                // 챕터에 몬스터가 없으면 마지막 챕터 몬스터 사용
                const lastChapterMonsters = monsters.filter(m => m.chapter === 7);
                const randomMonster = lastChapterMonsters[Math.floor(Math.random() * lastChapterMonsters.length)];
                const scaledHp = randomMonster.hp + (this.stage - 1) * 10;
                this.currentMonster = new Monster({...randomMonster, hp: scaledHp, maxHp: scaledHp});
            }
        }
        
        this.gameState = 'Combat';
    }

    _selectAndScaleMonster(monsterList) {
        const randomIndex = Math.floor(Math.random() * monsterList.length);
        const monsterData = monsterList[randomIndex];
        const scaledHp = monsterData.hp + (this.stage - 1) * 10;
        this.currentMonster = new Monster({...monsterData, hp: scaledHp, maxHp: scaledHp});
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
        
        return { success: true, message: `${itemData.name}을(를) 구매하고 장착했습니다.` };
    }

    upgradeWeapon(weaponId) {
        const weapon = this.allEquipment.find(w => w.id === weaponId);
        if (!weapon) {
            return { success: false, message: '무기를 찾을 수 없습니다.' };
        }
        
        const currentLevel = this.player.weaponUpgradeLevels[weaponId] || 0;
        const upgradeCost = 100 + currentLevel * 50; // 레벨이 높아질수록 비용 증가
        
        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (필요: ${upgradeCost})` };
        }
        
        this.player.gold -= upgradeCost;
        this.player.weaponUpgradeLevels[weaponId] = currentLevel + 1;
        weapon.base_value += 5; // 레벨당 5씩 증가
        
        return { 
            success: true, 
            message: `${weapon.name}이(가) Lv.${currentLevel + 1}로 업그레이드되었습니다! (+5 성능 증가)` 
        };
    }
    
    upgradeWeapons() {
        return { success: false, message: '이 기능은 더 이상 사용되지 않습니다.' };
    }
}

export default GameManager;
