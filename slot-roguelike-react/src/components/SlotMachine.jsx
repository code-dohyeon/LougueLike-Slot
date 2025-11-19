import React from 'react';
import SlotReel from './SlotReel';

function SlotMachine({ slotCount, slotResults, isSpinning, currentlyProcessingSlotIndex }) {
    const getIconForType = (type) => {
        switch(type) {
            case 'Attack': return '⚔️';
            case 'Defense': return '🛡️';
            case 'Resource': return '💰';
            default: return '❓';
        }
    };

    const reels = [];
    for (let i = 0; i < slotCount; i++) {
        // 스피닝 중일 때는 물음표, 멈췄을 때만 결과 표시
        const icon = (!isSpinning && slotResults) ? getIconForType(slotResults[i].type) : '❓';
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
        <div className="slot-container">
            {reels}
        </div>
    );
}

export default SlotMachine;