import DamagePopups from './DamagePopups';

function MonsterStatus({ monster, monsterImage, damagePopups }) {
    if (!monster) return null;

    const hpPercentage = Math.max(0, (monster.hp / monster.maxHp) * 100);
    const displayHp = Math.max(0, Math.floor(monster.hp));
    const currentMonsterImage = monsterImage.find(m => m.type === monster.type) || {};
    
    const isFrozen = monster.statusEffects && monster.statusEffects.some(
        effect => effect.type === 'Frozen'
    );
    // console.log(currentMonsterImage);

    return (
        <div className="game-status combat-element" style={{ position: 'relative' }} data-testid="monster-status">
            <DamagePopups popups={damagePopups} popupType="monster" />
            
            <div className="monster-info">
                <div className='monsterImage'></div>
                <div
                    className="monster-display"
                    // 💡 2. 오버레이를 위해 relative 속성 추가 (CSS에 없다면)
                    style={{ position: 'relative' }}
                >
                    {currentMonsterImage.src ? (
                        <img src={currentMonsterImage.src}
                        alt={currentMonsterImage.type}
                        className={`monster-image ${isFrozen ? 'frozen-animation' : ''}`} />
                    ) : (
                        <span>{currentMonsterImage.icon}</span>
                    )}

                    {/* 💡 3. Frozen 이펙트 오버레이 추가 */}
                    {isFrozen && (
                        <div 
                            className="frozen-overlay"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(173, 216, 230, 0.4)', // 연한 파란색 반투명
                                border: '3px solid #6495ED', // 파란색 테두리
                                borderRadius: '10px',
                                boxShadow: '0 0 15px rgba(100, 149, 237, 0.8)', // 은은한 빛
                                zIndex: 5,
                                pointerEvents: 'none', // 이펙트가 마우스 클릭을 막지 않도록
                            }}
                        ></div>
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