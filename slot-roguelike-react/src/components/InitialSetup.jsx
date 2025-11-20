import { useState } from 'react';

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

    // 기본 무기(requiredLevel: 0) 또는 해금된 무기만 표시
    const availableWeapons = allEquipment.filter(item => 
        item.requiredLevel === 0 || item.unlocked === true
    );
    
    // console.log('Available weapons for selection:', availableWeapons.map(w => ({
    //     id: w.id,
    //     name: w.name,
    //     unlocked: w.unlocked,
    //     requiredLevel: w.requiredLevel
    // })));

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
                        data-testid={`weapon-card-${weapon.id}`}
                    >
                        {selectedWeapons.includes(weapon.id) && (
                            <div className="selection-badge">
                                {selectedWeapons.indexOf(weapon.id) + 1}
                            </div>
                        )}
                        
                        <div className="weapon-icon-large">
                            <img src={weapon.src} alt={weapon.name} className='initial-weapon-icon' />
                        </div>
                        
                        <div className="weapon-info">
                            <h3 className="weapon-name">
                                {weapon.name}
                                {weapon.unlocked && weapon.requiredLevel > 0 && (
                                    <span style={{ 
                                        marginLeft: '0.5rem', 
                                        fontSize: '0.8rem', 
                                        color: '#fbbf24' 
                                    }}>
                                        🔓
                                    </span>
                                )}
                            </h3>
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
                data-testid="button-start-combat"
            >
                전투 시작! ({selectedWeapons.length}/3)
            </button>
        </div>
    );
}

export default InitialSetup;