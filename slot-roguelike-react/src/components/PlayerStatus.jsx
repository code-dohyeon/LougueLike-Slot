import React from 'react';

function PlayerStatus({ player, stage }) {
    const hpPercentage = (player.hp / player.maxHP) * 100;

    return (
        <div className="player-status">
            <div className="stat-item">
                <span className="stat-label">HP</span>
                <span className="stat-value" id="player-hp-value">{Math.max(0, Math.floor(player.hp))} / {player.maxHP}</span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">DF</span>
                <span className="stat-value" id="player-df">{Math.floor(player.df)}</span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">GOLD</span>
                <span className="stat-value" id="player-gold">{Math.floor(player.gold)}</span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">STAGE</span>
                <span className="stat-value">{stage}</span>
            </div>
        </div>
    );
}

export default PlayerStatus;
