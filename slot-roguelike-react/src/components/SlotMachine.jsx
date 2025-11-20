// SlotMachine.jsx (수정)

import SlotReel from './SlotReel';
import { equipmentMap, equipment } from '../logic/data';

// 💡 매개변수에 currentEquipment를 추가해!
function SlotMachine({ slotCount, slotResults, isSpinning, currentlyProcessingSlotIndex, currentEquipment }) {
    const reels = [];
    // console.log(currentEquipment);
    
    // 릴의 개수만큼 반복
    for (let i = 0; i < slotCount; i++) {
        
        let item = null;
        
        // 1. **스핀 결과**가 있으면 그 결과를 사용 (스핀 후)
        if (slotResults && slotResults[i]) {
            item = equipmentMap[slotResults[i].id];
        } 
        
        // 2. **스핀 결과가 없고** (게임 시작 시) **장착된 무기**가 있으면 그 무기를 사용!
        else if (currentEquipment && currentEquipment[i]) {
            // currentEquipment에는 무기 객체가 통째로 들어있다고 가정할게.
            item = equipment.filter(item => item.id === currentEquipment[i])[0]; 
        }
        // console.log(item)

        // 3. 1, 2 모두 아니면 (예외적인 경우) 임의의 아이템을 사용 (기존 로직 유지)
        if (!item) {
            const randomIndex = Math.floor(Math.random() * equipment.length);
            item = equipment[randomIndex];
        }
        // console.log(!item ? item.src : 'default_icon_path')

        const icon = item ? item : 'default_icon_path'; // item이 없을 경우 대비
        // console.log(item, icon);
        const isProcessing = currentlyProcessingSlotIndex === i;
        
        reels.push(
            <SlotReel 
                key={i} 
                icon={icon}
                isSpinning={isSpinning}
                isProcessing={isProcessing}
            />
        );
    }

    return (
        <div className="slot-container combat-element">
            {reels}
        </div>
    );
}

export default SlotMachine;