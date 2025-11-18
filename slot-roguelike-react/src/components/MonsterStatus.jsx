// src/components/MonsterStatus.jsx

import React from 'react';

function MonsterStatus({ monster, damagePopups = [] }) {
    // 몬스터 정보가 없거나 이미 죽었으면 (HP가 0) 표시 안 함
    if (!monster || monster.hp <= 0) {
        return null;
    }
    
    const maxHP = monster.maxHp;
    const currentHP = Math.max(0, monster.hp);
    const hpPercent = (currentHP / maxHP) * 100;

    // 몬스터는 HP가 낮아질수록 색깔이 녹색으로 변하도록 (플레이어와 반대)
    const hpColor = currentHP > (maxHP / 2) ? '#ef4444' : currentHP > (maxHP / 5) ? '#fbbf24' : '#4ade80';

    return (
        <div id="game-status" className="game-status">
            <div className="monster-info">
                {/* 몬스터 아이콘, HP 바 등 */}
                {damagePopups.map(popup => (
                    <div key={popup.id} className={`damage-popup ${popup.type}`}>
                        -{popup.value}
                    </div>
                ))}
            </div>
            <div id="monster-hp-bar" className="monster-hp-bar">
                <div 
                    id="monster-hp-fill" 
                    className="monster-hp-fill" 
                    style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                >
                    {currentHP} / {maxHP}
                </div>
            </div>
        </div>
    );
}

export default MonsterStatus;