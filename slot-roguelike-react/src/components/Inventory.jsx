import React from 'react';

function Inventory({ player, shopItems, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="inventory-overlay" onClick={onClose}>
            <div className="inventory-container" onClick={(e) => e.stopPropagation()}>
                <div className="inventory-header">
                    <h2 className="inventory-title">📦 인벤토리</h2>
                    <button className="inventory-close" onClick={onClose}>✕</button>
                </div>
                
                <div className="inventory-stats">
                    <div className="inv-stat">
                        <span className="inv-stat-label">HP:</span>
                        <span className="inv-stat-value">{Math.floor(player.hp)} / {player.maxHP}</span>
                    </div>
                    <div className="inv-stat">
                        <span className="inv-stat-label">DF:</span>
                        <span className="inv-stat-value">{Math.floor(player.df)}</span>
                    </div>
                    <div className="inv-stat">
                        <span className="inv-stat-label">Gold:</span>
                        <span className="inv-stat-value">{Math.floor(player.gold)}</span>
                    </div>
                    <div className="inv-stat">
                        <span className="inv-stat-label">슬롯:</span>
                        <span className="inv-stat-value">{player.slotCount}</span>
                    </div>
                </div>

                <h3 className="inventory-section-title">⚔️ 장착 중인 장비</h3>
                <div className="inventory-grid">
                    {player.equippedWeapons.length === 0 ? (
                        <div className="inventory-empty">장착된 장비가 없습니다.</div>
                    ) : (
                        player.equippedWeapons.map(weaponId => {
                            const weapon = shopItems.find(w => w.id === weaponId);
                            if (!weapon) return null;
                            
                            const level = player.weaponUpgradeLevels[weaponId] || 0;
                            
                            return (
                                <div key={weaponId} className="inventory-item">
                                    <div className="inv-item-icon">
                                        {weapon.type === 'Attack' && '⚔️'}
                                        {weapon.type === 'Defense' && '🛡️'}
                                        {weapon.type === 'Resource' && '💰'}
                                    </div>
                                    <div className="inv-item-info">
                                        <div className="inv-item-name">{weapon.name}</div>
                                        <div className="inv-item-level">Lv.{level}</div>
                                        <div className="inv-item-stats">
                                            {weapon.base_value} {weapon.damage_type || weapon.type}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Inventory;