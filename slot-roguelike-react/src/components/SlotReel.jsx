import React, { useMemo } from 'react';
import { equipment } from '../logic/data';

// 릴이 돌아갈 때 표시될 모든 아이콘 목록을 정의합니다.
// (data.js에 있는 모든 장비의 icon 값을 여기에 넣어주세요)
const ALL_ICONS = [];
      ALL_ICONS.push(...equipment.map(item => item.src));
    //   console.log(ALL_ICONS);


function SlotReel({ icon, isSpinning, isProcessing }) {
    // Spinning 상태일 때 보여줄 무작위 아이콘 스트립을 한 번만 생성합니다.
    const spinningReelContent = useMemo(() => {
        const reelLength = 20; // 릴 스트립에 들어갈 아이콘의 개수 (길수록 애니메이션이 자연스러워집니다)
        const content = [];
        for (let i = 0; i < reelLength; i++) {
            const randomIcon = ALL_ICONS[Math.floor(Math.random() * ALL_ICONS.length)];
            
            // console.log(icon)
            content.push(<div key={i} className="slot-item"><img src={randomIcon} alt="" /></div>);
        }
        // 마지막에 첫 번째 아이콘을 한 번 더 넣어 자연스러운 루프를 만듭니다.
        content.push(<div key={reelLength} className="slot-item">{ALL_ICONS[0]}</div>);
        return content;
    }, [isSpinning]); // isSpinning 상태가 바뀔 때만 다시 생성

    return (
        <div className={`slot-reel-container ${isProcessing ? 'is-processing' : ''}`}>
            <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
                {isSpinning ? (
                    // 💡 Spinning 중: 무작위 아이콘들의 띠(strip)를 보여주고 CSS 애니메이션으로 돌립니다.
                    <div className="slot-reel-strip">
                        <img src={icon.src} alt="" className="slot-icon" />
                    </div>
                ) : (
                    // 💡 멈췄을 때: 최종 결과 아이콘을 보여줍니다.
                    <div className="slot-item final-icon">
                        <img src={icon.src} alt="Slot Icon" className="slot-icon" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SlotReel;