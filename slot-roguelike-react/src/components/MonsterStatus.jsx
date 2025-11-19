import React from 'react';

function MonsterStatus({ monster }) {
    if (!monster) return null;

    const hpPercentage = Math.max(0, (monster.hp / monster.maxHp) * 100);
    const displayHp = Math.max(0, Math.floor(monster.hp));

    return (
        <div className="game-status">
            <div className="monster-info">
                <span>{monster.icon} {monster.type}</span>
                {monster.isBoss && <span style={{ marginLeft: '10px', color: '#fbbf24' }}>👑 BOSS</span>}
            </div>
            <div className="monster-hp-bar">
                <div 
                    className="monster-hp-fill" 
                    style={{ width: `${hpPercentage}%` }}
                />
            </div>
            <div style={{ 
                textAlign: 'center', 
                marginTop: '0.5rem', 
                color: '#fca5a5',
                fontWeight: 'bold'
            }}>
                {displayHp} / {monster.maxHp}
            </div>
        </div>
    );
}

export default MonsterStatus;
