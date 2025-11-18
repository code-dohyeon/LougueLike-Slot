// src/components/Shop.jsx

import React from 'react';
import { useGame } from '../hooks/useGame';

function Shop({ player, stage, onUpgradeHp, onUpgradeSlot, onNextStage }) {
    // 💡 슬롯 개수가 최대치(5)인지 확인하는 로직
    const isSlotMaxed = player.slotCount >= 5;
    const { getShopItems, handleBuyWeapon, handleUpgradeWeapons, playerState } = useGame();
    const shopItems = getShopItems();

    return (
        <div id="shop-container" className="shop-container">
            {/* 클리어 스테이지 정보 (현재 stage가 다음 스테이지 번호이므로 -1) */}
            <h2 className="shop-title">✨ STAGE {stage - 1} CLEAR! ✨</h2>
            
            {/* 골드 정보 */}
            <p className="shop-gold">
                현재 골드: <span id="shop-gold-value" className="gold-highlight">{player.gold}</span>
            </p>

            {/* 업그레이드 버튼 그룹 */}
            <div className="shop-buttons">
                {/* 최대 HP 업그레이드 버튼 */}
                <button 
                    id="upgrade-hp-btn" 
                    className="btn btn-upgrade"
                    onClick={onUpgradeHp}
                    // 골드 부족 시 비활성화
                    disabled={player.gold < 50}
                >
                    최대 HP +10 (50 Gold)
                </button>

                {/* 슬롯 개수 업그레이드 버튼 */}
                <button 
                    id="upgrade-slot-btn" 
                    className="btn btn-upgrade"
                    onClick={onUpgradeSlot}
                    // 최대 슬롯이거나 골드가 부족할 경우 비활성화
                    disabled={isSlotMaxed || player.gold < 100}
                >
                    슬롯 개수 +1 (100 Gold)
                    {isSlotMaxed && ' (최대치)'}
                </button>
            </div>

            <button onClick={handleUpgradeWeapons}>
                전체 무기 업그레이드 (150 골드)
            </button>
            
            <h3>구매 가능 무기</h3>
            {shopItems.map(item => (
                <div key={item.id}>
                    {item.name} ({item.base_value} {item.damage_type}) - {item.cost} 골드 
                    <button onClick={() => handleBuyWeapon(item.id)}>구매 및 장착</button>
                </div>
            ))}
            

            {/* 다음 스테이지 버튼 */}
            <button 
                id="next-stage-btn" 
                className="btn btn-next"
                onClick={onNextStage}
            >
                다음 전투로 🚀
            </button>
        </div>
    );
}

export default Shop;