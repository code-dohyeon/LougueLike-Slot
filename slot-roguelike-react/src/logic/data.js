// data.js

// 💡 슬롯 아이템 풀은 더 이상 사용하지 않음 (모든 아이템은 아래 'equipment'에서 관리)

// 💡 모든 장비를 통합 관리하는 배열
export const equipment = [
    // ⚔️ 나무 검 (Attack)
    { id: 'SWD_01', name: '나무 검', type: 'Attack', base_value: 10, damage_type: 'Physical', cost: 0, unlocked: true }, 
    
    // 🛡️ 나무 방패 (Defense) - 기본 장비로 추가
    { id: 'SHD_01', name: '나무 방패', type: 'Defense', base_value: 5, target: 'Player', cost: 0, unlocked: true }, 

    // 💰 코인 (Resource) - 기본 장비로 추가
    { id: 'RSC_01', name: '코인', type: 'Resource', base_value: 50, target: 'Player', cost: 0, unlocked: true }, 

    // 🗡️ 독 단검 (Attack)
    { id: 'DGR_01', name: '독 단검', type: 'Attack', base_value: 40, damage_type: 'Poison', cost: 150, unlocked: true }, 

    // 🪓 양날 도끼 (Attack)
    { id: 'AXE_01', name: '양날 도끼', type: 'Attack', base_value: 15, damage_type: 'Physical', cost: 300, unlocked: false } 
];

// 💡 ID로 장비 객체를 쉽게 찾기 위한 맵
export const equipmentMap = equipment.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});

// 💡 몬스터 구조 (이전과 동일)
export const monsters = [
    {type: 'goblin', icon: '😈', hp: 50, df: 0, atk: 10, attackCount: 1, turnAtkIncrease: 2}, 
    {type: 'slime', icon: '🤢', hp: 80, df: 5, atk: 15, attackCount: 2, turnAtkIncrease: 3},
    {type: 'skeleton', icon: '💀', hp: 120, df: 10, atk: 20, attackCount: 1, turnAtkIncrease: 5}
];