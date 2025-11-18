// src/components/PlayerStatus.jsx

import React from 'react';

function PlayerStatus({ player, stage, onRestart }) {
    const hpPercent = Math.max(0, (player.hp / player.maxHP) * 100);
    const hpColor = hpPercent > 50 ? '#4ade80' : hpPercent > 20 ? '#fbbf24' : '#ef4444';

    return (
        <div className="player-status">
            <div className="stat-item stage-display">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                    <div className="stat-label">STAGE</div>
                    <div className="stat-value">{stage}</div>
                </div>
            </div>

            <div className="stat-item hp-display">
                <div className="stat-icon">❤️</div>
                <div className="stat-content">
                    <div className="stat-label">HP</div>
                    <div className="hp-bar-container">
                        <div className="hp-bar-outer">
                            <div 
                                className="hp-bar-fill" 
                                style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                            ></div>
                        </div>
                        <div className="hp-bar-text">{player.hp} / {player.maxHP}</div>
                    </div>
                </div>
            </div>

            <div className="stat-item">
                <div className="stat-icon">🛡️</div>
                <div className="stat-content">
                    <div className="stat-label">SHIELD</div>
                    <div id="player-df" className="stat-value shield-value">{player.df}</div>
                </div>
            </div>
            
            <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                    <div className="stat-label">GOLD</div>
                    <div id="player-gold" className="stat-value gold-value">{player.gold}</div>
                </div>
            </div>
            
            <div className="stat-item">
                <div className="stat-icon">⚔️</div>
                <div className="stat-content">
                    <div className="stat-label">ATK</div>
                    <div className="stat-value atk-value">{player.atk}</div>
                </div>
            </div>
            
            {/* Restart Button */}
            <button id="restart-button" className="btn btn-danger btn-restart-compact" onClick={onRestart}>
                🔄 다시 시작
            </button>
        </div>
    );
}

export default PlayerStatus;