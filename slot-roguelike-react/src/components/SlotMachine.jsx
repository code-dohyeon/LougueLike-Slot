// src/components/SlotMachine.jsx

import React from 'react';
import SlotReel from './SlotReel';

// 슬롯 이모지 맵 (바닐라 JS에서 가져온 매핑)
const itemEmogiMap = {
    'Attack': '⚔️',
    'Defense': '🛡️',
    'Resource': '💰'
};

function SlotMachine({ slotCount, slotResults, isSpinning }) {
    // 💡 Array.from을 사용하여 slotCount만큼 릴 배열을 생성하고 순회
    const reels = Array.from({ length: slotCount }, (_, index) => {
        // 결과 배열에서 해당 릴의 결과 아이템을 가져옴
        const itemResult = slotResults ? slotResults[index] : null; 
        
        return (
            <SlotReel
                key={index} // React에서 반복문 렌더링 시 필수
                item={itemResult}
                isSpinning={isSpinning}
                emojiMap={itemEmogiMap}
            />
        );
    });

    // CSS Grid/Flexbox 설정을 위해 slot-container 클래스 사용
    return (
        <div id="slot-container" className="slot-container">
            {reels}
        </div>
    );
}

export default SlotMachine;