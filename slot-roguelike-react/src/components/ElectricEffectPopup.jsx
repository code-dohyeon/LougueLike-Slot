// src/components/ElectricEffectPopup.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ElectricEffectPopup.css'; // CSS 파일 임포트

const ElectricEffectPopup = ({ active, position = { x: 50, y: 50 } }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (active) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 1000); // CSS 애니메이션 시간과 일치 (1초)

            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!isVisible) return null;

    // 팝업의 위치를 동적으로 조정 (몬스터 위치에 맞춰 중앙에 배치)
    const popupStyle = {
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)', // 중앙 정렬
        position: 'absolute',
        zIndex: 1000,
    };

    return (
        <div className="electric-effect-popup" style={popupStyle}>
            <span className="electric-text">ELECTRIC!</span>
            {/* 추가적인 스파크/번개 이펙트 요소를 CSS로 구현 */}
            <div className="spark spark-1"></div>
            <div className="spark spark-2"></div>
            <div className="spark spark-3"></div>
        </div>
    );
};

export default ElectricEffectPopup;