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
        // this.restartGame();
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
        
        // console.log('Loaded progress - Level:', this.playerLevel, 'EXP:', this.playerExp);
        // console.log('Unlocked weapons:', this.allEquipment.filter(w => w.unlocked).map(w => w.name));
    }
    
    saveProgress() {
        if(localStorage !== undefined) {
            localStorage.setItem('playerLevel', this.playerLevel.toString());
            localStorage.setItem('playerExp', this.playerExp.toString());
            localStorage.setItem('unlockedWeapons', JSON.stringify(this.unlockedWeapons));
        }
        // console.log("Saving Level:", this.playerLevel, "EXP:", this.playerExp, "Unlocked:", this.unlockedWeapons);
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
            alert(`🎉 레벨 ${this.playerLevel} 달성! 해금된 무기: ${weaponNames}`);
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

        // console.log("Eligible weapons for level", level, ":", eligibleWeapons.map(w => w.name));

        // 해금할 무기가 없으면 종료
        if (eligibleWeapons.length === 0) {
            // console.log("No weapons to unlock at level", level);
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
            
            // console.log(`Unlocked: ${weapon.name} (Level ${level})`);
        }
    }
    
    gainExperience(expAmount) {
        this.playerExp += expAmount;
        const newLevel = Math.floor(this.playerExp / 100);
        // console.log("Gained EXP:", expAmount, "Total EXP:", this.playerExp, "New Level:", newLevel);
        
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
            if(resultArray[i].id === resultArray[i+1].id) { 
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

    checkCombo(slotResults) {
        const minComboLength = 3; // 콤보를 위한 최소 길이

        if (slotResults.length < minComboLength) {
            return false; // 전체 슬롯 개수가 3개 미만이면 콤보 불가
        }

        // 배열을 처음(인덱스 0)부터 순회하며 3개 연속으로 같은 ID가 있는지 확인
        // 순회는 (전체 길이 - 콤보 길이)까지만 하면 돼 (그래야 i+2까지 접근 가능)
        for (let i = 0; i <= slotResults.length - minComboLength; i++) {
            const item1Id = slotResults[i].id;
            const item2Id = slotResults[i + 1].id; // 다음 칸
            const item3Id = slotResults[i + 2].id; // 그 다음 칸

            // 3개의 ID가 모두 같으면 콤보 성공
            if (item1Id === item2Id && item2Id === item3Id) {
                // 이 로직 덕분에 [A, B, B, B, C] 같은 경우,
                // i=1 일 때 [B, B, B]를 찾고 바로 true를 반환하게 돼.
                return true;
            }
        }

        // 모든 구간을 체크했지만 콤보를 찾지 못했으면 false 반환
        return false;
    }

    processSingleSlotResult(itemResult, multiplier) {
        if (itemResult.type !== 'Attack') {
            const result = this.item.processSlotResult(
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
                // 💡 수정: 중복된 필드를 제거하고 item.js의 result에서 가져온 값만 사용
                defenseGain: result.defenseGain, 
                goldGain: result.goldGain 
            };
        }
        
        // 💥 Attack 타입일 경우, 데미지 및 상태이상 적용
        const damage = itemResult.base_value * multiplier;
        const damage_type = itemResult.damage_type;
        let actualDamageTaken = 0;
        
        // 1. Holy/Dark/Magic처럼 특수한 데미지 계산이 필요한 경우 먼저 처리
        if (damage_type === 'Holy') {
            // Holy: 상대 최대 체력 비례 데미지
            const holyDamage = this.currentMonster.maxHp * 0.1;
            actualDamageTaken = this.currentMonster.takeDamage(holyDamage, true); // true: 쉴드 무시
        } else if (damage_type === 'Dark') {
            // Dark: 즉사 확률 적용 (데미지도 들어야 하니 일반 공격 먼저)
            actualDamageTaken = this.currentMonster.takeDamage(damage); 
            
            // 즉사 확률 적용 로직을 item.js로 옮기는 것이 깔끔함.
            // 여기서는 기본 데미지만 처리하고, item.js에서 상태이상(즉사)을 처리하자.
        } else if (damage_type === 'Magic') {
            // Magic: 쉴드 무시하고 체력에 직접 피해
            actualDamageTaken = this.currentMonster.takeDamage(damage, true); // true: 쉴드 무시
        } else {
            // Physical, Poison, Fire, Ice, Lightning 등 일반 공격
            actualDamageTaken = this.currentMonster.takeDamage(damage);
        }

        // 2. 상태 이상 적용 (item.js 호출)
        const statusResult = this.item.processSlotResult(
            [itemResult], // Attack 타입이 item.js로 들어감
            this.currentMonster,
            this.player,
            multiplier
        );

        // 3. 반환값 정리 (Attack 타입)
        const result = {
            physicalDamage: damage_type === 'Physical' ? actualDamageTaken : 0,
            poisonDamage: damage_type === 'Poison' ? actualDamageTaken : 0, 
            fireDamage: damage_type === 'Fire' ? actualDamageTaken : 0,
            iceDamage: damage_type === 'Ice' ? actualDamageTaken : 0,
            lightningDamage: damage_type === 'Lightning' ? actualDamageTaken : 0,
            holyDamage: damage_type === 'Holy' ? actualDamageTaken : 0,
            darkDamage: damage_type === 'Dark' ? actualDamageTaken : 0,
            magicDamage: damage_type === 'Magic' ? actualDamageTaken : 0,
            defenseGain: 0,
            goldGain: 0
        };

        if (damage_type === 'Dark' && this.currentMonster.hp === 0) {
             result.darkDamage = this.currentMonster.maxHp; 
        }

        // 몬스터 사망 체크는 이 함수 밖 (startPlayerTurn)에서 한번에 하는 게 좋음
        
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
        let statusEffectResult = { 
            poisonDamage: 0, 
            fireDamage: 0, 
            skipTurn: false 
        }; 
        let shieldAbsorbed = 0;
        let isFrozenSkip = false; // 💡 isFrozenSkip 플래그 초기화
        let didTurnSkip = false;
        let isElectricSkip = false;

        const wasFrozen = this.currentMonster && this.currentMonster.statusEffects.some(e => e.type === 'Frozen');
        const wasElectric = this.currentMonster && this.currentMonster.statusEffects.some(e => e.type === 'Electric');

        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            // 💡 processStatusEffects의 결과를 statusEffectResult 객체에 저장
            statusEffectResult = this.currentMonster.processStatusEffects();

            // 💡 Frozen 상태였고 턴 스킵이 발생했다면 isFrozenSkip 플래그 설정
            if (wasFrozen && statusEffectResult.skipTurn) {
                isFrozenSkip = true;
            }

            if (wasElectric && statusEffectResult.skipTurn) {
                isElectricSkip = true;
            }

            if(this.aliveChecked(this.currentMonster)) {
                this.handleMonsterDefeat();
                // 💡 반환 객체에 damageReport와 skippedTurn 필드 추가
                return { 
                    status: 'win', 
                    damageTaken: 0, 
                    poisonDamage: statusEffectResult.poisonDamage + statusEffectResult.fireDamage, // 레거시 필드
                    shieldAbsorbed: 0, 
                    skippedTurn: statusEffectResult.skipTurn, 
                    damageReport: { Poison: statusEffectResult.poisonDamage, Fire: statusEffectResult.fireDamage } // 💡 분리된 damageReport
                };
            }
        }

        // 몬스터 턴 스킵 여부 체크 (Frozen, Shock 효과)
        if (statusEffectResult.skipTurn) { 
            didTurnSkip = true;
            this.currentMonster.increaseAttack(); 
            // 💡 반환 객체에 damageReport와 skippedTurn 필드 추가
            return { 
                status: 'continue', 
                damageTaken: 0, 
                poisonDamage: statusEffectResult.poisonDamage + statusEffectResult.fireDamage, 
                shieldAbsorbed: 0, 
                skippedTurn: didTurnSkip, 
                isFrozenSkip: isFrozenSkip,
                damageReport: { Poison: statusEffectResult.poisonDamage, Fire: statusEffectResult.fireDamage } // 💡 분리된 damageReport
            };
        }
        
        const absorbedDamage = Math.min(this.currentMonster.atk, this.player.df);
        shieldAbsorbed = absorbedDamage;
        const actualDamage = this.player.takeDamage(this.currentMonster.atk);

        if (this.currentMonster.increaseAttack) { 
            this.currentMonster.increaseAttack(); 
        }
        
        if(this.player.hp <= 0) {
            this.gameState = 'GameOver';
            // 💡 반환 객체에 damageReport와 skippedTurn 필드 추가
            return { 
                status: 'lose', 
                damageTaken: actualDamage, 
                poisonDamage: statusEffectResult.poisonDamage + statusEffectResult.fireDamage, 
                shieldAbsorbed, 
                skippedTurn: didTurnSkip, 
                damageReport: { Poison: statusEffectResult.poisonDamage, Fire: statusEffectResult.fireDamage } 
            };
        }

        // 💡 반환 객체에 damageReport와 skippedTurn 필드 추가
        return { 
            status: 'continue', 
            damageTaken: actualDamage, 
            poisonDamage: statusEffectResult.poisonDamage + statusEffectResult.fireDamage, 
            shieldAbsorbed, 
            skippedTurn: didTurnSkip, 
            isFrozenSkip: false,
            isElectricSkip: isElectricSkip,
            damageReport: { Poison: statusEffectResult.poisonDamage, Fire: statusEffectResult.fireDamage } 
        };
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