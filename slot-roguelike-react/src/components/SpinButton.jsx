function SpinButton({ onClick, isSpinning, isBlocked }) {
    return (
        <div className="button-container combat-element" style={{ position: 'relative' }}>
            <button 
                id="spin-btn" 
                className="btn btn-spin"
                onClick={onClick}
                disabled={isSpinning}
                data-testid="button-spin"
            >
                {isSpinning ? '처리 중...' : '슬롯 돌리기'}
            </button>
            {isBlocked && (
                <div className="spin-blocker" data-testid="spin-blocker"></div>
            )}
        </div>
    );
}

export default SpinButton;