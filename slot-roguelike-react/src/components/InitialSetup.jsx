import React, { useState } from 'react';

function InitialSetup({ allEquipment, setWeapons }) {
    const [selectedWeaponIds, setSelectedWeaponIds] = useState([]);
    const MAX_SELECTION = 3;

    const toggleWeaponSelection = (itemId) => {
        if (selectedWeaponIds.includes(itemId)) {
            setSelectedWeaponIds(prev => prev.filter(id => id !== itemId));
        } else if (selectedWeaponIds.length < MAX_SELECTION) {
            setSelectedWeaponIds(prev => [...prev, itemId]);
        }
    };
    
    const handleStartGame = () => {
        if (selectedWeaponIds.length === MAX_SELECTION) {
            setWeapons(selectedWeaponIds);
        } else {
            alert(`무기 ${MAX_SELECTION}개를 선택해야 게임을 시작할 수 있습니다.`);
        }
    }

    const initialWeapons = allEquipment.filter(item => item.unlocked);

    const getItemIcon = (type, damageType) => {
        if (type === 'Attack') {
            return damageType === 'Physical' ? '⚔️' : '🗡️';
        } else if (type === 'Defense') {
            return '🛡️';
        } else if (type === 'Resource') {
            return '💰';
        }
        return '❓';
    };

    return (
        <div className="initial-setup-container">
            <h2 className="setup-title">⚔️ 초기 장비 선택 ⚔️</h2>
            <p className="setup-subtitle">
                전투에 사용할 장비 {MAX_SELECTION}개를 선택하세요
            </p>
            
            <div className="weapon-selection-horizontal">
                {initialWeapons.map(item => (
                    <div
                        key={item.id}
                        className={`weapon-card ${selectedWeaponIds.includes(item.id) ? 'selected' : ''}`}
                        onClick={() => toggleWeaponSelection(item.id)}
                    >
                        {selectedWeaponIds.includes(item.id) && (
                            <div className="selection-badge">✓</div>
                        )}
                        
                        <div className="weapon-icon-large">
                            {getItemIcon(item.type, item.damage_type)}
                        </div>
                        
                        <div className="weapon-info">
                            <h4 className="weapon-name">{item.name}</h4>
                            <p className="weapon-stats">
                                {item.type === 'Attack' && `${item.damage_type === 'Physical' ? '물리' : '독'} 공격 ${item.base_value}`}
                                {item.type === 'Defense' && `방어력 ${item.base_value}`}
                                {item.type === 'Resource' && `골드 ${item.base_value}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                className="btn btn-start-combat" 
                onClick={handleStartGame}
                disabled={selectedWeaponIds.length !== MAX_SELECTION}
            >
                {selectedWeaponIds.length === MAX_SELECTION 
                    ? '전투 시작!' 
                    : `장비 선택 중 (${selectedWeaponIds.length}/${MAX_SELECTION})`
                }
            </button>
        </div>
    );
}

export default InitialSetup;
