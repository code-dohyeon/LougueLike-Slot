// src/components/PlayerStatus.jsx

import React from 'react';

function PlayerStatus({ player, stage, onRestart }) {
    // 💡 HP 게이지 비율 계산
    const hpPercent = (player.hp / player.maxHP) * 100;
    // HP가 낮아질수록 색깔이 변하는 로직 (CSS의 클래스나 직접 스타일로 적용)
    const hpColor = hpPercent > 50 ? '#4ade80' : hpPercent > 20 ? '#fbbf24' : '#ef4444';

    return (
        <div className="player-status">
            {/* Stage Info */}
            <p className="stage-info">
                STAGE: <span id="stage-value" className="stat-highlight">{stage}</span>
            </p>

            {/* HP Bar */}
            <div className="hp-bar-container">
                <div className="hp-bar-label">HP: {player.hp} / {player.maxHP}</div>
                <div className="hp-bar-outer">
                    <div 
                        className="hp-bar-fill" 
                        style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                    ></div>
                </div>
            </div>

            {/* Stats */}
            <div className="player-stats-detailed">
                <p>🛡️ SHIELD: <span id="player-df" className="stat-highlight">{player.df}</span></p>
                <p>💰 GOLD: <span id="player-gold" className="stat-highlight">{player.gold}</span></p>
                <p>⚔️ ATK: <span className="stat-highlight">{player.atk}</span></p>
            </div>
            
            {/* Restart Button: onRestart 함수를 useGame 훅에서 받아와 연결 */}
            <button id="restart-button" className="btn btn-danger" onClick={onRestart}>
                게임 다시 시작
            </button>
        </div>
    );
}

export default PlayerStatus;