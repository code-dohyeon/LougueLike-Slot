import SlotReel from './SlotReel';
import { equipmentMap } from '../logic/data';
// import { equippedWeapons } from '../logic/player';

function SlotMachine({ slotCount, slotResults, isSpinning, currentlyProcessingSlotIndex }) {
    const reels = [];
    for (let i = 0; i < slotCount; i++) {
        // 💡 slotResults[i].id를 사용하여 해당 아이템의 아이콘을 가져옵니다.
        const item = slotResults ? equipmentMap[slotResults[i].id] : null;
        const icon = (!isSpinning && item) ? item.src : '❓';
        console.log(icon);
        
        const isProcessing = currentlyProcessingSlotIndex === i;
        
        reels.push(
            <SlotReel 
                key={i} 
                icon={icon} // 💡 수정된 icon 사용
                isSpinning={isSpinning}
                isProcessing={isProcessing}
            />
        );

        // console.log(reels.filter(reel => reel.icon));
    }

    return (
        <div className="slot-container combat-element">
            {reels}
        </div>
    );
}

export default SlotMachine;
