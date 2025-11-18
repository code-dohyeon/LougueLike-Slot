// src/components/SlotReel.jsx

import React from 'react';

// 회전 중일 때 보여줄 임시 이모지 목록
const SPINNING_EMOJIS = ['❓', '⚔️', '🛡️', '💰', '✨', '💀'];

function SlotReel({ item, isSpinning, emojiMap, isProcessing }) {
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

        if (isProcessing) {
            console.log(`릴 ${item.type}이(가) 처리 중입니다! (isProcessing: ${isProcessing})`);
        }

        return () => clearInterval(interval); // 컴포넌트가 사라지거나 상태가 바뀔 때 인터벌 해제
    }, [isSpinning, item, emojiMap]);


    const slotClass = [
        'slot-reel-container', 
        item && item.type ? `slot-type-${item.type.toLowerCase()}` : '',
        isProcessing ? 'is-processing' : '' // 💡 핵심! 이 클래스를 CSS에서 사용
    ].join(' ');

    // console.log(isProcessing);

    return (
        <div className={slotClass}>
            <div className="slot-reel">
                {displayContent}
            </div>
            
            {/* 💡 (선택 사항) 이펙트가 발동될 때 데미지 팝업을 릴 아래에 보여줄 수도 있습니다. */}

        </div>
    );
}

export default SlotReel;
