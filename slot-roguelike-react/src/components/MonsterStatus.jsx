import DamagePopups from './DamagePopups';

function MonsterStatus({ monster, monsterImage, damagePopups, fireElementDamage }) {
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

            {/* 💡 [추가 3] 몬스터 공격력 표시 */}
            <div className="monster-attack-info" style={{ 
                textAlign: 'center', 
                marginTop: '0.5rem', 
                color: '#e5e7eb', // 밝은 회색으로 변경
                fontWeight: 'bold',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '0.5rem',
                fontSize: '1rem'
            }}></div>

            {/* 💡 [수정] 상태이상 아이콘 및 정보 표시 (절대 위치, 간결하게) */}
            {monster.statusEffects && monster.statusEffects.length > 0 && (
                <div 
                    className="monster-status-effects-container" 
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '5px' 
                    }}
                >
                    {monster.statusEffects
                        // 도트딜 효과(Poison, Fire)만 표시
                        .filter(e => e.type === 'Poison' || e.type === 'Fire') 
                        .map((effect, index) => (
                        <div 
                            key={index} 
                            className={`status-effect-icon ${effect.type.toLowerCase()}`}
                            style={{ 
                                // 디자인 스타일은 이전과 동일하게 유지
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '45px',       
                                height: '45px',      
                                borderRadius: '50%', 
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                border: `2px solid ${effect.type === 'Poison' ? '#4CAF50' : '#FF9800'}`,
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                boxShadow: `0 0 8px ${effect.type === 'Poison' ? '#4CAF50' : '#FF9800'}`,
                                position: 'relative'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{effect.type === 'Poison' ? '☠️' : '🔥'}</span>
                            
                            {/* 💡 [핵심 수정] 턴당 피해량과 남은 턴 수를 함께 표시 */}
                            <span 
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '0', // 하단에 배치
                                    backgroundColor: 'rgba(0,0,0,0.9)',
                                    borderRadius: '5px',
                                    padding: '1px 3px',
                                    fontSize: '0.65rem', // 조금 더 크게
                                    lineHeight: '1',
                                    whiteSpace: 'nowrap', // 줄 바꿈 방지
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    transform: 'translateY(100%)', // 아이콘 밖으로 완전히 빼기
                                    // 💡 데미지 정보는 아이콘 아래에 붙여서 표시
                                }}
                            >
                                <span style={{ color: effect.type === 'Poison' ? '#90EE90' : '#FFA07A' }}>
                                    {Math.floor(effect.damage)}
                                </span>
                                / {effect.duration}T
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MonsterStatus;