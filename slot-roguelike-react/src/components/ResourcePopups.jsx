function ResourcePopups({ popups = [] }) {
    const typeInfo = {
        gold: { color: '#fbbf24', icon: '💰', prefix: '+' },
        defense: { color: '#3b82f6', icon: '🛡️', prefix: '+' },
        'shield-lost': { color: '#ef4444', icon: '🛡️', prefix: '-' }
    };
    
    return (
        <>
            {popups.map((popup) => {
                const info = typeInfo[popup.type] || typeInfo.gold;
                const offset = Math.floor(Math.random() * 40) - 20;
                
                return (
                    <div
                        key={popup.id}
                        className="resource-popup"
                        style={{
                            color: info.color,
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            textShadow: `
                                0 0 15px ${info.color},
                                0 0 30px ${info.color},
                                3px 3px 6px #000
                            `,
                            position: 'absolute',
                            left: `calc(50% + ${offset}px)`,
                            top: '20%',
                            transform: 'translateX(-50%)',
                            zIndex: 15,
                            pointerEvents: 'none',
                            animation: 'resourceFloat 1.2s ease-out forwards',
                            opacity: 0
                        }}
                        data-testid={`resource-popup-${popup.type}`}
                    >
                        {info.icon} {info.prefix}{popup.value}
                    </div>
                );
            })}
        </>
    );
}

export default ResourcePopups;