// gameManager.js

import Player from './player.js';
import Monster from './monster.js';
import Item from './item.js';
// import { totalPhysicalDamage, totalPoisonDamage } from './item.js'
// 💡 수정: monsters, equipmentMap, equipment를 가져옴
import SlotMachine from './slotMachine.js';
import { monsters, equipmentMap, equipment } from './data.js';

class GameManager {
    constructor() {
        this.item = new Item();
        this.player = new Player();
        // SlotMachine은 player 인스턴스를 받아서 장비 목록을 참조함
        this.slotMachine = new SlotMachine(this.player); 
        
        // 💡 수정: 모든 장비 데이터를 저장
        this.allEquipment = equipment; 
        
        // 몬스터 자동 생성 제거: 무기 선택 후 생성해야 함
        this.currentMonster = null; 
        this.stage = 1;
        
        // 💡 게임 상태를 'InitialSetup'으로 설정하여 무기 선택 창으로 시작
        this.gameState = 'InitialSetup'; 
    }

    // 💡 [새 함수] 슬롯 결과 배열을 받아 콤보 배율을 계산합니다.
    calculateMultiplier(resultArray) {
        let comboCheck = 0;
        
        for(let i = 0; i < resultArray.length - 1; i++) {
            // 💡 콤보는 타입이 연속으로 3개 이상 같을 때 (즉, 2번 연속 같으면)로 가정합니다.
            if(resultArray[i].type === resultArray[i+1].type) { 
                comboCheck++;
                if(comboCheck >= 2) { // 3개 연속
                    return 3.0; 
                }
            } else {
                comboCheck = 0;
            }
        }
        
        return 1.0; // 콤보 없음
    }

    // 💡 [새 함수] 단일 슬롯 결과 처리 함수 (useGame.js에서 호출)
    processSingleSlotResult(itemResult, multiplier) {
        // item.js의 processSlotResult는 배열을 받으므로, 단일 아이템을 배열로 감싸서 전달
        // player와 currentMonster는 GameManager에서 관리
        const actionResult = this.item.processSlotResult(
            [itemResult],          // 단일 아이템을 배열로 감싸서 전달
            this.currentMonster,   // target
            this.player,           // player
            multiplier             // 계산된 콤보 배율 전달
        );
        
        // Item.js의 반환값: {totalPhysicalDamage: number, totalPoisonDamage: number}
        // useGame.js에서 필요한 팝업 정보만 추출하여 반환
        return { 
            physicalDamage: actionResult.totalPhysicalDamage, 
            // totalPoisonDamage가 0보다 크면 독이 적용된 것으로 간주
            poisonApplied: actionResult.totalPoisonDamage > 0 
        };
    }

    // // 💡 [수정] 턴을 시작하고 결과를 계산만 해서 반환 (실제 적용은 useGame.js가 순차적으로 함)
    // startPlayerTurn() {
    //     const slotCount = this.player.equippedWeapons.length || 3;
    //     const resultArray = this.slotMachine.spin(slotCount);
        
    //     // 콤보 배율 계산 (결과가 전부 나온 후 계산)
    //     const multiplier = this.calculateMultiplier(resultArray); 
        
    //     // 결과와 배율을 반환
    //     return {
    //         results: resultArray,
    //         multiplier: multiplier
    //     };
    // }

    aliveChecked(monster) {
        if(monster.hp <= 0) {
            return true;
        }
        else return false;
    }

    // 💡 초기 장비 장착 (3개 ID를 받음)
    setInitialWeapons(itemIds) {
        if (itemIds.length !== 3) {
            console.error("3개의 장비 ID가 필요합니다.");
            return;
        }

        // 선택된 장비 ID를 Player에 장착
        this.player.equippedWeapons = itemIds; 

        // 몬스터 생성 및 게임 시작 준비
        this.prepareNextCombat(); 
        this.gameState = 'Combat'; // 상태를 Combat으로 전환
    }

    // startTurn() {
    //     const resultArray = this.slotMachine.spin(this.player.slotCount);
    //     const { totalPhysicalDamage, totalPoisonDamage } = this.item.processSlotResult(resultArray, this.currentMonster, this.player);

    //     if(this.aliveChecked(this.currentMonster)) {
    //         // 승리 로직
    //         this.player.gold += 100 + this.stage * 10;
    //         this.stage++;
    //         this.gameState = 'ShopPhase'; // 💡 상태를 상점으로 변경
    //         return { status: 'win', results: resultArray, damage: { physical: totalPhysicalDamage, poison: totalPoisonDamage } };
    //     }
        
    //     // 전투 계속
    //     return { status: 'continue', results: resultArray, damage: { physical: totalPhysicalDamage, poison: totalPoisonDamage } };
    // }
    
    // 💡 [새 함수] 몬스터 처치 시 보상 및 상태 업데이트
    handleMonsterDefeat() {
        if (!this.currentMonster || this.currentMonster.hp > 0) {
            console.error("ERROR: 몬스터가 살아있거나 존재하지 않습니다. 이 함수는 몬스터 사망 후에 호출되어야 합니다.");
            return;
        }

        // 1. 보상 획득 (골드)
        this.player.gold += 100 + this.stage * 10;
        
        // 2. 스테이지 증가
        this.stage++;

        // 3. 게임 상태 전환
        this.gameState = 'ShopPhase'; 

        // 4. (선택 사항) 몬스터 정보 초기화 (새로운 몬스터는 상점 다음 단계에서 준비됨)
        this.currentMonster = null; 
        
        console.log(`STAGE ${this.stage - 1} 클리어! 상점 페이즈로 이동합니다. (획득 골드: ${100 + (this.stage - 1) * 10})`);
    }

    // processMonsterPoisonDamage() {
    //     if (!this.currentMonster || !this.currentMonster.processStatusEffects) {
    //         return { status: 'continue', poisonDamage: 0 };
    //     }
        
    //     const poisonDamage = this.currentMonster.processStatusEffects();

    //     // 독 피해로 몬스터가 죽었는지 체크
    //     if(this.aliveChecked(this.currentMonster)) {
    //         // 승리 로직
    //         this.player.gold += 100 + this.stage * 10;
    //         this.stage++;
    //         this.gameState = 'ShopPhase';
    //         return { status: 'win', poisonDamage: poisonDamage };
    //     }

    //     return { status: 'continue', poisonDamage: poisonDamage };
    // }

    // 💡 [수정] 몬스터의 독 피해 처리와 일반 공격을 모두 수행하는 통합 함수
    monsterAttack() { 
        let totalPoisonDamage = 0;

        // 0. 몬스터 턴 시작 시 독 피해 처리
        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            totalPoisonDamage = this.currentMonster.processStatusEffects();

            // 독 피해로 몬스터가 죽었는지 체크
            if(this.aliveChecked(this.currentMonster)) {
                this.handleMonsterDefeat(); // 💡 승리 로직을 새로 만든 함수로 대체!
                // 💡 승리 시 독 피해량과 status: 'win' 반환
                return { status: 'win', damageTaken: 0, poisonDamage: totalPoisonDamage }; 
            }
        }
        
        // 1. 몬스터의 일반 공격
        const actualDamage = this.player.takeDamage(this.currentMonster.atk);

        // 2. 몬스터 공격력 증가 로직
        if (this.currentMonster.increaseAttack) { 
            this.currentMonster.increaseAttack(); 
        }
        
        // 3. 패배 체크
        if(this.player.hp <= 0) {
            this.gameState = 'GameOver'; // 👈 💡 [최종 FIX] 게임 상태 변경
            // 💡 패배 시 독 피해량과 status: 'lose' 반환
            return { status: 'lose', damageTaken: actualDamage, poisonDamage: totalPoisonDamage };
        }

        // 💡 전투 지속 시 독 피해량과 status: 'continue' 반환
        return { status: 'continue', damageTaken: actualDamage, poisonDamage: totalPoisonDamage };
    }
    
    // 💡 플레이어 턴 함수 (나중에 턴 분리를 위해 이 함수를 나눌 예정)

    prepareNextCombat() {
        // 1. 현재 스테이지에 해당하는 몬스터 Tier 결정
        // 예시 규칙: 1-3 스테이지: Tier 1, 4-6 스테이지: Tier 2, 7-9 스테이지: Tier 3...
        // 💡 3스테이지마다 난이도가 올라가게 계산
        // Math.ceil(1/3)=1, Math.ceil(3/3)=1, Math.ceil(4/3)=2
        const requiredTier = Math.ceil(this.stage / 3); 
        
        // 2. 해당 Tier에 맞는 몬스터 목록 필터링
        // 💡 몬스터 목록에서 requiredTier와 tier 값이 같은 몬스터만 선택
        const suitableMonsters = monsters.filter(m => m.tier === requiredTier);
        
        // 🚨 예외 처리: 만약 해당 Tier에 몬스터가 없다면? (예: 모든 Tier 5 몬스터를 다 깼다면)
        if (suitableMonsters.length === 0) {
            console.warn(`Tier ${requiredTier}에 해당하는 몬스터가 없습니다! 마지막 Tier 몬스터 중에서 랜덤 선택을 시도합니다.`);
            // 대안: 그냥 전체 몬스터 중에서 랜덤 선택하거나, 마지막 Tier 몬스터 중에서 고르게 할 수 있음.
            const lastTier = monsters.reduce((max, m) => Math.max(max, m.tier || 0), 0);
            const fallbackMonsters = monsters.filter(m => m.tier === lastTier);

            if (fallbackMonsters.length > 0) {
                return this._selectAndScaleMonster(fallbackMonsters); // 💡 아래 별도 함수로 분리 제안
            } else {
                console.error("게임을 진행할 몬스터가 없습니다!");
                this.gameState = 'GameOver'; // 몬스터가 없으면 게임 오버나 엔딩으로 처리
                return;
            }
        }

        // 3. 필터링된 목록에서 몬스터 선택 및 스케일링
        this._selectAndScaleMonster(suitableMonsters);
    }

    // 💡 (새 함수 제안) 몬스터 선택 및 HP 스케일링 로직을 분리하여 재사용성 높임
    _selectAndScaleMonster(monsterList) {
        const randomIndex = Math.floor(Math.random() * monsterList.length);
        const monsterData = monsterList[randomIndex];

        // 💡 스케일링 로직은 그대로 유지 (스테이지가 높아지면 HP가 증가)
        const scaledHp = monsterData.hp + (this.stage - 1) * 10;

        // 몬스터의 MaxHP와 현재 HP를 동기화하여 생성
        this.currentMonster = new Monster({...monsterData, hp: scaledHp, maxHp: scaledHp});
        this.gameState = 'Combat';
    }

    // 💡 [새 함수] 무기 구매 및 장착 로직
    buyAndEquipWeapon(itemId) {
        // this.allEquipment는 data.js의 equipment를 참조함
        const itemData = this.allEquipment.find(item => item.id === itemId);

        if (!itemData) {
            console.error(`ERROR: Item ID ${itemId} not found.`);
            return { success: false, message: '아이템을 찾을 수 없습니다.' };
        }
        
        // 1. 이미 장착 중인지 확인 (장착된 무기를 가지고 있는 것으로 간주)
        if (this.player.equippedWeapons.includes(itemId)) {
            return { success: false, message: '이미 장착 중인 무기입니다.' };
        }
        
        // 2. 골드 확인
        console.log(this.player.gold);
        // if (this.player.gold < itemData.cost) {
        //     return { success: false, message: `골드가 부족합니다! (필요 골드: ${itemData.cost})` };
        // }
        
        // // 3. 슬롯 공간 확인
        // // (Player의 slotCount는 useGame.js의 upgradeSlotCount 로직에 따라 최대 5개로 늘어날 수 있음)
        // if (this.player.equippedWeapons.length >= this.player.slotCount) {
        //      // 🚨 현재 슬롯이 꽉 찼을 때 교체 로직은 UI에서 처리해야 하므로, 일단 구매 불가 처리
        //      return { success: false, message: '슬롯이 꽉 찼습니다. 기존 무기를 제거하거나 슬롯을 늘려주세요.' };
        // }
        
        // 4. 구매 및 장착
        this.player.gold -= itemData.cost; // 골드 차감
        this.player.equippedWeapons.push(itemId); // 장착 목록에 추가
        
        return { success: true, message: `${itemData.name}을(를) 구매하고 장착했습니다.` };
    }

    // 💡 [새 함수] 무기 업그레이드 로직 (전체 공격/방어 아이템의 기본 성능을 영구 증가)
    upgradeWeapons() {
        const upgradeCost = 150; 
        const upgradeValue = 2; // 기본 성능 2 증가 (예시)

        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (업그레이드 비용: ${upgradeCost})` };
        }
        
        // 1. 골드 차감
        this.player.gold -= upgradeCost;
        
        // 💡 [핵심 수정] 2. 모든 장비의 기본 성능을 영구적으로 증가시키는 로직
        let upgradedCount = 0;
        
        // this.allEquipment는 data.js의 equipment 배열을 참조함 (장비 마스터 목록)
        this.allEquipment.forEach(item => { 
            // Attack, Defense, Resource 타입 아이템에만 적용
            if (item.type === 'Attack' || item.type === 'Defense' || item.type === 'Resource') {
                // 주의: 장비 마스터 데이터 자체의 base_value를 증가시켜야 함
                item.base_value += upgradeValue;
                upgradedCount++;
                // console.log(`[UPGRADE] ${item.name}의 기본값: +${upgradeValue}. 현재 ${item.base_value}`);
            }
        });
        
        // 3. (선택 사항) 다음 업그레이드 비용을 올리는 로직 등
        
        return { success: true, message: `모든 장비의 기본 성능이 ${upgradeValue}만큼 상승했습니다! (${upgradedCount}개)` };
    }
}

export default GameManager;
