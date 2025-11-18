// src/components/MonsterStatus.jsx

import React from 'react';

function MonsterStatus({ monster, damagePopups = [] }) {
    if (!monster || monster.hp <= 0) {
        return null;
    }
    
    const maxHP = monster.maxHp;
    const currentHP = Math.max(0, monster.hp);
    const hpPercent = (currentHP / maxHP) * 100;
    const hpColor = currentHP > (maxHP / 2) ? '#ef4444' : currentHP > (maxHP / 5) ? '#fbbf24' : '#4ade80';

    // const monsterEmoji = monster.name.includes('슬라임') ? '🟢' :
    //                     monster.name.includes('고블린') ? '👹' :
    //                     monster.name.includes('오우거') ? '👿' :
    //                     monster.name.includes('드래곤') ? '🐉' : '👾';

    return (
        <div id="game-status" className="game-status">
            <div className="monster-info-card">
                {/* <div className="monster-avatar">{monsterEmoji}</div> */}
                <div className="monster-details">
                    <div className="monster-name">{monster.name}</div>
                    <div className="monster-level">LV. {monster.stage}</div>
                </div>
            </div>
            
            <div id="monster-hp-bar" className="monster-hp-bar">
                <div 
                    id="monster-hp-fill" 
                    className="monster-hp-fill" 
                    style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                >
                    <span className="monster-hp-text">{currentHP} / {maxHP}</span>
                </div>
            </div>
            
            {damagePopups.map(popup => (
                <div key={popup.id} className={`damage-popup ${popup.type}`}>
                    {popup.type === 'poisonApply' ? '☠️ POISON!' : `-${popup.value}`}
                </div>
            ))}
        </div>
    );
}

export default MonsterStatus;