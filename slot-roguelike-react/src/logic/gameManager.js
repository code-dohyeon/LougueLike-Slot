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
        const { totalPhysicalDamage, totalPoisonDamage } = this.item.processSlotResult(resultArray, this.currentMonster, this.player);

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

    // 💡 몬스터 공격 함수 (독 피해 처리를 포함)
    monsterAttack() { 
        // 0. 💡 몬스터 턴 시작 시 독 피해 처리 및 승리 체크
        if (this.currentMonster && this.currentMonster.processStatusEffects) {
            // 독 피해를 적용하고 몬스터의 HP를 업데이트
            this.currentMonster.processStatusEffects();

            // 독 피해로 몬스터가 죽었는지 다시 체크
            if(this.aliveChecked(this.currentMonster)) {
                this.player.gold += 100 + this.stage * 10;
                this.stage++;
                // 몬스터 공격 없이 독 피해로 승리!
                return { status: 'win', damageTaken: 0 }; 
            }
        }
        
        // 1. 몬스터의 공격
        const actualDamage = this.player.takeDamage(this.currentMonster.atk);

        // 2. 몬스터 공격력 증가 로직 (있는 경우)
        if (this.currentMonster.increaseAttack) { 
            this.currentMonster.increaseAttack(); 
        }
        
        // 3. 패배 체크
        if(this.player.hp <= 0) {
            return { status: 'lose', damageTaken: actualDamage };
        }

        return { status: 'continue', damageTaken: actualDamage };
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
}

export default GameManager;