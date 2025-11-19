import { equipmentMap } from "./data.js"; 

class SlotMachine {
    constructor(player) {
        this.player = player;
    }

    spin(slotCount) {
        const slotPool = [];
        
        this.player.equippedWeapons.forEach(itemId => {
            const item = equipmentMap[itemId];
            if (item) {
                slotPool.push({
                    type: item.type,
                    id: item.id,
                    base_value: item.base_value, 
                    target: item.target,
                    damage_type: item.damage_type
                });
            }
        });

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
