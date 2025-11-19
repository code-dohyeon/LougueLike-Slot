import React from 'react';

function DamagePopups({ popups = [], popupType = 'player' }) {
    // 속성별 데미지 팝업 스타일/아이콘
    const typeInfo = {
        physical: { color: '#e74c3c', icon: popupType === 'player' ? '💥' : '⚔️' },
        fire: { color: '#ff9800', icon: '🔥' },
        poison: { color: '#43a047', icon: '☠️' },
        ice: { color: '#00bcd4', icon: '❄️' },
        lightning: { color: '#fdd835', icon: '⚡' },
        holy: { color: '#f5e663', icon: '✨' },
        dark: { color: '#6c3483', icon: '🌑' },
        magic: { color: '#8e44ad', icon: '🪄' }
    };
    
    return (
        <>
            {popups.map((popup, idx) => {
                const offset = Math.floor(Math.random() * 40) - 20; // -20~+20px 랜덤 오프셋
                return (
                    <div
                        key={popup.id}
                        className={`${popupType}-damage-popup popup-${popup.type}`}
                        style={{
                            color: typeInfo[popup.type]?.color || '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            textShadow: '0 0 8px #000',
                            position: 'absolute',
                            left: `calc(50% + ${offset}px)`,
                            transform: 'translateX(-50%)',
                            zIndex: 10,
                            pointerEvents: 'none',
                            transition: 'top 0.8s cubic-bezier(.17,.67,.83,.67)'
                        }}
                    >
                        {typeInfo[popup.type]?.icon || ''} -{popup.value}
                    </div>
                );
            })}
        </>
    );
}

export default DamagePopups;
