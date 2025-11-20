import DamagePopups from './DamagePopups';

function MonsterStatus({ monster, monsterImage, damagePopups }) {
    if (!monster) return null;

    const hpPercentage = Math.max(0, (monster.hp / monster.maxHp) * 100);
    const displayHp = Math.max(0, Math.floor(monster.hp));
    const currentMonsterImage = monsterImage.find(m => m.type === monster.type) || {};
    
    // console.log(currentMonsterImage);

    return (
        <div className="game-status combat-element" style={{ position: 'relative' }} data-testid="monster-status">
            <DamagePopups popups={damagePopups} popupType="monster" />
            
            <div className="monster-info">
                <div className='monsterImage'></div>
                <div className="monster-display">
                    {currentMonsterImage.src ? (
                        <img src={currentMonsterImage.src} alt={currentMonsterImage.type} className="monster-image" />
                    ) : (
                        <span>{currentMonsterImage.icon}</span>
                    )}
                </div>
                <span>{monster.type}</span>
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
            }} data-testid="monster-hp">
                {displayHp} / {monster.maxHp}
            </div>
        </div>
    );
}

export default MonsterStatus;