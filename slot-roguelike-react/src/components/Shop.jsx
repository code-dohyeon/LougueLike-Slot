// src/components/Shop.jsx

import React from 'react';

function Shop({ 
    player, 
    stage, 
    onUpgradeHp, 
    onUpgradeSlot, 
    onNextStage, 
    shopItems,
    handleBuyWeapon,
    handleUpgradeWeapons
}) {
    const isSlotMaxed = player.slotCount >= 5;

    return (
        <div id="shop-container" className="shop-container">
            <h2 className="shop-title">✨ STAGE {stage - 1} CLEAR! ✨</h2>
            
            <p className="shop-gold">
                현재 골드: <span id="shop-gold-value" className="gold-highlight">{player.gold}</span>
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

                <button 
                    id="upgrade-weapons-btn" 
                    className="btn btn-upgrade"
                    onClick={handleUpgradeWeapons}
                    disabled={player.gold < 150}
                >
                    <div className="btn-icon">⚔️</div>
                    <div className="btn-text">
                        <div>전체 무기 업그레이드</div>
                        <div className="btn-cost">150 Gold</div>
                    </div>
                </button>
            </div>
            
            <h3 className="shop-section-title">🛡️ 구매 가능 무기</h3>
            <div className="shop-item-grid">
                {shopItems.map(item => (
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
                ))}
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