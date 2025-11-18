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

    startTurn() {
        const resultArray = this.slotMachine.spin(this.player.slotCount);
        const { totalPhysicalDamage, totalPoisonDamage, gold } = this.item.processSlotResult(resultArray, this.currentMonster, this.player);


        
        if(this.aliveChecked(this.currentMonster)) {
            // 승리 로직
            this.player.gold += 100 + this.stage * 10;
            this.stage++;
            this.gameState = 'ShopPhase'; // 💡 상태를 상점으로 변경
            return { status: 'win', results: resultArray, damage: { physical: totalPhysicalDamage, poison: totalPoisonDamage } };
        }
        
        // 전투 계속
        return { status: 'continue', results: resultArray, damage: { physical: totalPhysicalDamage, poison: totalPoisonDamage } };
    }

    processMonsterPoisonDamage() {
        if (!this.currentMonster || !this.currentMonster.processStatusEffects) {
            return { status: 'continue', poisonDamage: 0 };
        }
        
        const poisonDamage = this.currentMonster.processStatusEffects();

        // 독 피해로 몬스터가 죽었는지 체크
        if(this.aliveChecked(this.currentMonster)) {
            // 승리 로직
            this.player.gold += 100 + this.stage * 10;
            this.stage++;
            this.gameState = 'ShopPhase';
            return { status: 'win', poisonDamage: poisonDamage };
        }

        return { status: 'continue', poisonDamage: poisonDamage };
    }

    // 💡 [수정] 몬스터의 독 피해 처리와 일반 공격을 모두 수행하는 통합 함수
    monsterAttack() { 
        let totalPoisonDamage = 0; // 💡 UI 팝업을 위해 독 피해량 추적

        // 0. 💡 [요구사항 반영] 몬스터 턴 시작 시 독 피해 처리 (공격 성공 여부와 상관없음)
        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            totalPoisonDamage = this.currentMonster.processStatusEffects(); // <-- 독 피해량 저장
            
            // 독 피해로 몬스터가 죽었는지 체크
            if(this.aliveChecked(this.currentMonster)) {
                this.player.gold += 100 + this.stage * 10;
                this.stage++;
                this.gameState = 'ShopPhase'; // 독 피해로 인한 승리
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
        const randomIndex = Math.floor(Math.random() * monsters.length);
        const monsterData = monsters[randomIndex];

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
        if (this.player.gold < itemData.cost) {
            return { success: false, message: `골드가 부족합니다! (필요 골드: ${itemData.cost})` };
        }
        
        // 3. 슬롯 공간 확인
        // (Player의 slotCount는 useGame.js의 upgradeSlotCount 로직에 따라 최대 5개로 늘어날 수 있음)
        if (this.player.equippedWeapons.length >= this.player.slotCount) {
             // 🚨 현재 슬롯이 꽉 찼을 때 교체 로직은 UI에서 처리해야 하므로, 일단 구매 불가 처리
             return { success: false, message: '슬롯이 꽉 찼습니다. 기존 무기를 제거하거나 슬롯을 늘려주세요.' };
        }
        
        // 4. 구매 및 장착
        this.player.gold -= itemData.cost; // 골드 차감
        this.player.equippedWeapons.push(itemId); // 장착 목록에 추가
        
        return { success: true, message: `${itemData.name}을(를) 구매하고 장착했습니다.` };
    }

    // 💡 [새 함수] 무기 업그레이드 로직 (전체 공격/방어 아이템의 기본 성능을 영구 증가)
    upgradeWeapons() {
        const upgradeCost = 150; 
        const upgradeValue = 2; // 기본 성능 2 증가

        if (this.player.gold < upgradeCost) {
            return { success: false, message: `골드가 부족합니다! (업그레이드 비용: ${upgradeCost})` };
        }
        
        // 1. 골드 차감
        this.player.gold -= upgradeCost;
        
        // 2. 공격/방어 아이템의 base_value를 영구적으로 증가
        let itemsUpgraded = 0;
        this.allEquipment.forEach(item => { // allEquipment는 data.js의 equipment를 참조함
            if (item.type === 'Attack' || item.type === 'Defense') {
                item.base_value += upgradeValue;
                itemsUpgraded++;
            }
        });
        
        return { success: true, message: `모든 공격/방어 아이템의 기본 성능이 ${upgradeValue}만큼 증가했습니다! (총 ${itemsUpgraded}개 아이템)` };
    }
}

export default GameManager;