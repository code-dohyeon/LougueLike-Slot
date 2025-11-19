import React from 'react';

function Shop({ 
    player, 
    stage, 
    onUpgradeHp, 
    onUpgradeSlot, 
    onNextStage, 
    shopItems,
    handleBuyWeapon,
    handleSellWeapon,
    game,
    handleUpgradeWeapon
}) {
    const isSlotMaxed = player.slotCount >= 5;

    const handleUpgrade = (weaponId) => {
        const result = handleUpgradeWeapon(weaponId);
        // console.log(result, result.)
        alert(result);
    };

    const handleSell = (weaponId) => {
        if (window.confirm('정말 이 무기를 판매하시겠습니까?')) {
            handleSellWeapon(weaponId);
        }
    };

    const availableShopItems = shopItems.filter(item => 
        item.unlocked && 
        item.cost > 0 && 
        !player.equippedWeapons.includes(item.id)
    );

    return (
        <div id="shop-container" className="shop-container">
            <h2 className="shop-title">✨ STAGE {stage - 1} CLEAR! ✨</h2>
            
            <p className="shop-gold">
                현재 골드: <span id="shop-gold-value" className="gold-highlight">{Math.floor(player.gold)}</span>
            </p>

            <div className="shop-upgrade-grid">
                <button 
                    id="upgrade-hp-btn" 
                    className="btn btn-upgrade"
                    onClick={onUpgradeHp}
                    disabled={player.gold < 50}
                >
                    <div className="btn-icon">❤️</div>
                    <div className="btn-text">
                        <div>최대 HP +10</div>
                        <div className="btn-cost">50 Gold</div>
                    </div>
                </button>

                <button 
                    id="upgrade-slot-btn" 
                    className="btn btn-upgrade"
                    onClick={onUpgradeSlot}
                    disabled={isSlotMaxed || player.gold < 100}
                >
                    <div className="btn-icon">🎰</div>
                    <div className="btn-text">
                        <div>슬롯 개수 +1</div>
                        <div className="btn-cost">{isSlotMaxed ? '(최대치)' : '100 Gold'}</div>
                    </div>
                </button>
            </div>
            
            <h3 className="shop-section-title">🛡️ 구매 가능 무기</h3>
            <div className="shop-item-grid">
                {availableShopItems.length === 0 ? (
                    <div style={{ 
                        color: '#c4b5fd', 
                        padding: '2rem', 
                        textAlign: 'center',
                        gridColumn: '1 / -1'
                    }}>
                        구매 가능한 무기가 없습니다.
                    </div>
                ) : (
                    availableShopItems.map(item => (
                        <div key={item.id} className="item-card">
                            <div className="item-icon">
                                {item.type === 'Attack' && '⚔️'}
                                {item.type === 'Defense' && '🛡️'}
                                {item.type === 'Resource' && '💰'}
                            </div>
                            
                            <h4 className="item-name">{item.name}</h4>
                            
                            <p className="item-stats">
                                {item.base_value} {item.damage_type || item.type}
                            </p>
                            
                            <p className="item-cost">{item.cost} 골드</p>
                            
                            <button 
                                className="buy-button"
                                onClick={() => handleBuyWeapon(item.id)}
                                disabled={player.gold < item.cost}
                            >
                                구매 및 장착
                            </button>
                        </div>
                    ))
                )}
            </div>
            
            <h3 className="shop-section-title">⚒️ 장착 무기 관리</h3>
            <div className="shop-item-grid">
                {player.equippedWeapons.length === 0 ? (
                    <div style={{ 
                        color: '#c4b5fd', 
                        padding: '2rem', 
                        textAlign: 'center',
                        gridColumn: '1 / -1'
                    }}>
                        장착된 무기가 없습니다.
                    </div>
                ) : (
                    player.equippedWeapons.map(weaponId => {
                        const weapon = shopItems.find(w => w.id === weaponId);
                        if (!weapon) return null;
                        
                        const currentLevel = player.weaponUpgradeLevels[weaponId] || 0;
                        const upgradeCost = weapon.cost + currentLevel * 50;
                        const sellPrice = Math.floor(weapon.cost * 0.5);
                        
                        return (
                            <div key={weaponId} className="item-card">
                                <div className="item-icon">
                                    {weapon.type === 'Attack' && '⚔️'}
                                    {weapon.type === 'Defense' && '🛡️'}
                                    {weapon.type === 'Resource' && '💰'}
                                </div>
                                
                                <h4 className="item-name">{weapon.name} Lv.{currentLevel}</h4>
                                
                                <p className="item-stats">
                                    {weapon.base_value} {weapon.damage_type || weapon.type}
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                                    <button 
                                        className="buy-button"
                                        onClick={() => handleUpgrade(weaponId)}
                                        disabled={player.gold < upgradeCost}
                                        style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                                    >
                                        업그레이드 (+5) - {upgradeCost}G
                                    </button>
                                    
                                    <button 
                                        className="buy-button"
                                        onClick={() => handleSell(weaponId)}
                                        disabled={player.equippedWeapons.length <= 1}
                                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                                    >
                                        판매 - {sellPrice}G
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            <button 
                id="next-stage-btn" 
                className="btn btn-next-stage"
                onClick={onNextStage}
            >
                다음 스테이지로 이동 ({stage})
            </button>
        </div>
    );
}

export default Shop;