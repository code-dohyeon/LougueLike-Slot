import React, { useState } from 'react';

function InitialSetup({ allEquipment, setWeapons }) {
    const [selectedWeapons, setSelectedWeapons] = useState([]);

    const handleWeaponClick = (weaponId) => {
        if (selectedWeapons.includes(weaponId)) {
            setSelectedWeapons(selectedWeapons.filter(id => id !== weaponId));
        } else {
            if (selectedWeapons.length < 3) {
                setSelectedWeapons([...selectedWeapons, weaponId]);
            } else {
                alert('최대 3개의 무기만 선택할 수 있습니다!');
            }
        }
    };

    const handleStart = () => {
        if (selectedWeapons.length !== 3) {
            alert('정확히 3개의 무기를 선택해주세요!');
            return;
        }
        setWeapons(selectedWeapons);
    };

    
    const availableWeapons = allEquipment.filter(item => item.cost === 0);

    return (
        <div className="initial-setup-container">
            <h2 className="setup-title">⚔️ 시작 장비 선택 ⚔️</h2>
            <p className="setup-subtitle">3개의 장비를 선택하세요</p>
            
            <div className="weapon-selection-horizontal">
                {availableWeapons.map(weapon => (
                    <div 
                        key={weapon.id}
                        className={`weapon-card ${selectedWeapons.includes(weapon.id) ? 'selected' : ''}`}
                        onClick={() => handleWeaponClick(weapon.id)}
                    >
                        {selectedWeapons.includes(weapon.id) && (
                            <div className="selection-badge">
                                {selectedWeapons.indexOf(weapon.id) + 1}
                            </div>
                        )}
                        
                        <div className="weapon-icon-large">
                            {weapon.type === 'Attack' && '⚔️'}
                            {weapon.type === 'Defense' && '🛡️'}
                            {weapon.type === 'Resource' && '💰'}
                        </div>
                        
                        <div className="weapon-info">
                            <h3 className="weapon-name">{weapon.name}</h3>
                            <p className="weapon-stats">
                                {weapon.type}: {weapon.base_value}
                                {weapon.damage_type && ` (${weapon.damage_type})`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                className="btn btn-start-combat"
                onClick={handleStart}
                disabled={selectedWeapons.length !== 3}
            >
                전투 시작! ({selectedWeapons.length}/3)
            </button>
        </div>
    );
}

export default InitialSetup;
