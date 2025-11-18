// src/components/SlotReel.jsx

import React from 'react';

// 회전 중일 때 보여줄 임시 이모지 목록
const SPINNING_EMOJIS = ['❓', '⚔️', '🛡️', '💰', '✨', '💀'];

function SlotReel({ item, isSpinning, emojiMap }) {
    const [displayContent, setDisplayContent] = React.useState('❓');
    
    // 💡 useEffect를 이용해 회전 애니메이션 시뮬레이션
    React.useEffect(() => {
        let interval;
        if (isSpinning) {
            // 회전 중일 때: 100ms마다 내용을 랜덤하게 바꿈
            interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * SPINNING_EMOJIS.length);
                setDisplayContent(SPINNING_EMOJIS[randomIndex]);
            }, 100);
        } else if (item && item.type) {
            // 회전이 멈추고 결과가 있을 때: 최종 결과를 표시
            clearInterval(interval);
            setDisplayContent(emojiMap[item.type] || item.type);
        } else {
            // 초기 상태
            setDisplayContent('❓');
        }

        return () => clearInterval(interval); // 컴포넌트가 사라지거나 상태가 바뀔 때 인터벌 해제
    }, [isSpinning, item, emojiMap]);

    // 슬롯 타입에 따라 CSS 클래스를 적용하여 결과를 시각적으로 강조
    const reelClass = item ? item.type.toLowerCase() : '';
    
    return (
        <div className="slot-reel-container">
            <div 
                className={`slot-reel ${reelClass} ${isSpinning ? 'spinning' : ''}`}
            >
                {displayContent}
            </div>
        </div>
    );
}

export default SlotReel;