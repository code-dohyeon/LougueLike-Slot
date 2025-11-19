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
                const offset = Math.floor(Math.random() * 60) - 30; // -30~+30px 랜덤 오프셋
                const verticalOffset = idx * 30; // 여러 팝업이 겹치지 않도록 세로 간격
                
                return (
                    <div
                        key={popup.id}
                        className={`${popupType}-damage-popup popup-${popup.type}`}
                        style={{
                            color: typeInfo[popup.type]?.color || '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.8rem',
                            textShadow: `
                                0 0 10px ${typeInfo[popup.type]?.color || '#000'},
                                0 0 20px ${typeInfo[popup.type]?.color || '#000'},
                                2px 2px 4px #000
                            `,
                            position: 'absolute',
                            left: `calc(50% + ${offset}px)`,
                            top: `calc(50% + ${verticalOffset}px)`,
                            transform: 'translateX(-50%)',
                            zIndex: 10 + idx,
                            pointerEvents: 'none',
                            animation: 'damageRise 1s ease-out forwards',
                            opacity: 0
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