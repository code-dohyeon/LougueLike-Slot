// components/ComboEffect.jsx
import React from 'react';
import '../styles/ComboEffect.css'; // CSS 파일 임포트

const ComboEffect = ({ active }) => {
    if (!active) return null;

    return (
        <div className="combo-effect-container">
            <div className="combo-text">COMBO!</div>
            <div className="combo-sparkle sparkle-1"></div>
            <div className="combo-sparkle sparkle-2"></div>
            <div className="combo-sparkle sparkle-3"></div>
        </div>
    );
};

export default ComboEffect;