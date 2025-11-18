// src/components/InitialSetup.jsx

import React, { useState } from 'react';

// 장비 속성 표시를 위한 유틸리티 함수
const getAttributeDisplay = (item) => {
    let displayAttr = '';
    let displayValue = item.base_value;

    if (item.type === 'Attack') {
        displayAttr = item.damage_type === 'Physical' ? '공격' : '독';
    } else if (item.type === 'Defense') {
        displayAttr = '방어';
    } else if (item.type === 'Resource') {
        displayAttr = '골드';
    }
    
    return `${item.name} (${displayAttr}: ${displayValue}) [${item.cost}G]`;
};


function InitialSetup({ allEquipment, setWeapons }) {
    // 💡 선택된 무기 ID들을 추적하는 상태
    const [selectedWeaponIds, setSelectedWeaponIds] = useState([]);
    const MAX_SELECTION = 3;

    // 💡 장비 클릭 핸들러
    const toggleWeaponSelection = (itemId) => {
        if (selectedWeaponIds.includes(itemId)) {
            // 선택 취소
            setSelectedWeaponIds(prev => prev.filter(id => id !== itemId));
        } else if (selectedWeaponIds.length < MAX_SELECTION) {
            // 새로 선택
            setSelectedWeaponIds(prev => [...prev, itemId]);
        }
    };
    
    // 💡 선택 완료 버튼 클릭 핸들러
    const handleStartGame = () => {
        if (selectedWeaponIds.length === MAX_SELECTION) {
            setWeapons(selectedWeaponIds); // useGame 훅으로 선택 결과 전달
        } else {
            alert(`무기 ${MAX_SELECTION}개를 선택해야 게임을 시작할 수 있습니다.`);
        }
    }

    // 초기 해금된 (unlocked: true) 장비만 표시 (기본 장비 SWD_01, SHD_01, RSC_01)
    const initialWeapons = allEquipment.filter(item => item.unlocked);

    return (
        <div id="initial-setup-container" className="initial-setup-container">
            <h2 className="setup-title">무기 3개 선택 후 게임 시작!</h2>
            
            <div id="weapon-selection-div" className="weapon-selection-grid">
                {initialWeapons.map(item => (
                    <div
                        key={item.id}
                        className={`item-card ${selectedWeaponIds.includes(item.id) ? 'selected' : ''}`}
                        onClick={() => toggleWeaponSelection(item.id)}
                    >
                        {getAttributeDisplay(item)}
                    </div>
                ))}
            </div>
            
            {/* 시작 버튼 */}
            <button 
                id="select-weapons-btn" 
                className="btn btn-start" 
                onClick={handleStartGame}
                disabled={selectedWeaponIds.length !== MAX_SELECTION}
            >
                무기 {selectedWeaponIds.length}/{MAX_SELECTION}개 선택 완료
            </button>
        </div>
    );
}

export default InitialSetup;