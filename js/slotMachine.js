// slotMachine.js

// 💡 수정: equipmentMap만 가져옴
import { equipmentMap } from "./data.js"; 

class SlotMachine {
    constructor(player) {
        this.player = player;
    }

    spin(slotCount) {
        const slotPool = [];
        
        // 💡 플레이어가 장착한 3개의 장비만 슬롯 풀에 추가
        this.player.equippedWeapons.forEach(itemId => {
            const item = equipmentMap[itemId];
            if (item) {
                // 장비 맵에서 아이템 속성을 가져와 슬롯 풀에 추가
                slotPool.push({
                    type: item.type, // Attack, Defense, Resource 중 하나
                    id: item.id,
                    base_value: item.base_value, 
                    target: item.target,
                    damage_type: item.damage_type // Attack이 아닌 경우 undefined가 들어갈 수 있음 (나중에 Item.js에서 처리)
                });
            }
        });

        // 💡 슬롯 풀에 3개의 장착 아이템이 들어가므로, 3개 중 하나가 랜덤하게 나옴.
        const resultArray = [];

        for(let i = 0; i < slotCount; i++) {
            resultArray.push(
                slotPool[Math.floor(Math.random() * slotPool.length)],
            );
        }

        return resultArray;
    }

    
}

export default SlotMachine;