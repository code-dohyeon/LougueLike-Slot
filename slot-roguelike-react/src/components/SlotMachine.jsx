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
        const icon = slotResults ? getIconForType(slotResults[i].type) : '❓';
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
