import React from 'react';

function SpinButton({ onClick, isSpinning }) {
    return (
        <div className="button-container">
            <button 
                id="spin-btn" 
                className="btn btn-spin"
                onClick={onClick}
                disabled={isSpinning}
            >
                {isSpinning ? '처리 중...' : '슬롯 돌리기'}
            </button>
        </div>
    );
}

export default SpinButton;
