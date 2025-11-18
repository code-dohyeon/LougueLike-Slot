import React from 'react';

function GameStart({ onStart }) {
    return (
        <div className="game-start-screen">
            <div className="game-start-content">
                <div className="game-logo">
                    <span className="logo-icon">🎰</span>
                    <h1 className="game-title">슬롯 RPG</h1>
                </div>
                <p className="game-subtitle">운명의 슬롯을 돌려 몬스터를 물리치세요!</p>
                <div className="game-features">
                    <div className="feature-item">
                        <span className="feature-icon">⚔️</span>
                        <span className="feature-text">전략적 전투</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🛡️</span>
                        <span className="feature-text">장비 수집</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">💰</span>
                        <span className="feature-text">골드 획득</span>
                    </div>
                </div>
                <button className="btn-game-start" onClick={onStart}>
                    게임 시작
                </button>
            </div>
        </div>
    );
}

export default GameStart;
