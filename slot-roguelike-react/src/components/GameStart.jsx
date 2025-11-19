import React from 'react';

function GameStart({ onStart }) {
    return (
        <div className="game-start-screen">
            <div className="game-start-content">
                <div className="game-logo">
                    <div className="logo-icon">🎰</div>
                    <h1 className="game-title">SLOT RPG</h1>
                </div>
                
                <p className="game-subtitle">슬롯을 돌려 몬스터를 처치하세요!</p>
                
                <div className="game-features">
                    <div className="feature-item">
                        <div className="feature-icon">⚔️</div>
                        <div className="feature-text">전투</div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🛡️</div>
                        <div className="feature-text">방어</div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">💰</div>
                        <div className="feature-text">보상</div>
                    </div>
                </div>
                
                <button 
                    className="btn-game-start"
                    onClick={onStart}
                >
                    게임 시작
                </button>
            </div>
        </div>
    );
}

export default GameStart;
