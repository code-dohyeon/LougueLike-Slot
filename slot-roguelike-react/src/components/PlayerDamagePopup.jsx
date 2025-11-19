import React, { useState, useEffect } from 'react';


function PlayerDamagePopup({ damage }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        let timer;
        if (damage > 0) {
            setIsVisible(true);
            timer = setTimeout(() => {
                setIsVisible(false);
            }, 800);
        } else {
            setIsVisible(false);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [damage]);

    if (!isVisible || damage <= 0) return null;

    return (
        <div className="player-damage-popup" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.5rem', textShadow: '0 0 8px #000', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            💥 -{damage}
        </div>
    );
}

export default PlayerDamagePopup;
