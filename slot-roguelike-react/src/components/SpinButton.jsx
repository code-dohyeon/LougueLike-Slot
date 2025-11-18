// src/components/SpinButton.jsx

import React from 'react';

function SpinButton({ onClick, isSpinning }) {
    return (
        <button 
            id="spin-button" 
            className="btn btn-spin" 
            onClick={onClick} 
            disabled={isSpinning} // isSpinning이 true일 때 비활성화 (전투 중)
        >
            {isSpinning ? '전투 중...' : '슬롯 돌리기 🎰'}
        </button>
    );
}

export default SpinButton;