import React from 'react';

function DamagePopup({ damage, type, onComplete }) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`damage-popup ${type}`}>
            -{damage}
        </div>
    );
}

export default DamagePopup;
