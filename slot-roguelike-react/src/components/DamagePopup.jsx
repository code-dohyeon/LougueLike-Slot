// src/components/DamagePopup.jsx

import React, { useState, useEffect } from 'react';

function DamagePopup({ damage }) {
    // 💡 팝업을 표시할지 여부를 관리
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 데미지가 0보다 크면 팝업 표시
        if (damage > 0) {
            setIsVisible(true);
            
            // 💡 팝업을 0.8초(800ms) 후 사라지게 함
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 800);

            // 클린업 함수: 컴포넌트 언마운트 시 타이머 해제
            return () => clearTimeout(timer);
        }
    }, [damage]); // damage 값이 바뀔 때마다 실행

    if (!isVisible) return null;

    return (
        // 💡 몬스터의 공격은 빨간색으로 표시하는 클래스
        <div className="damage-popup player-damage-taken">
            -{damage}
        </div>
    );
}

export default DamagePopup;
