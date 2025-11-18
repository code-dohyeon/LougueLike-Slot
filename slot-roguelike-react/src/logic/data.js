// data.js

// 💡 슬롯 아이템 풀은 더 이상 사용하지 않음 (모든 아이템은 아래 'equipment'에서 관리)

// 💡 모든 장비를 통합 관리하는 배열
export const equipment = [
    // ⚔️ 나무 검 (Attack)
    { id: 'SWD_01', name: '나무 검', type: 'Attack', base_value: 10, damage_type: 'Physical', cost: 0, unlocked: true }, 
    
    // 🛡️ 나무 방패 (Defense)
    { id: 'SHD_01', name: '나무 방패', type: 'Defense', base_value: 5, target: 'Player', cost: 0, unlocked: true }, 

    // 💰 코인 (Resource)
    { id: 'RSC_01', name: '코인', type: 'Resource', base_value: 50, target: 'Player', cost: 0, unlocked: true }, 

    // 🗡️ 독 단검 (Attack)
    { id: 'DGR_01', name: '독 단검', type: 'Attack', base_value: 4, damage_type: 'Poison', cost: 150, unlocked: false }, 

    // 🪓 양날 도끼 (Attack)
    { id: 'AXE_01', name: '양날 도끼', type: 'Attack', base_value: 15, damage_type: 'Physical', cost: 300, unlocked: false },

    // ⚔️ 강철 검 (Attack)
    { id: 'SWD_02', name: '강철 검', type: 'Attack', base_value: 25, damage_type: 'Physical', cost: 400, unlocked: false },

    // 🔥 화염 검 (Attack)
    { id: 'SWD_03', name: '화염 검', type: 'Attack', base_value: 35, damage_type: 'Fire', cost: 600, unlocked: false },

    // ❄️ 얼음 검 (Attack)
    { id: 'SWD_04', name: '얼음 검', type: 'Attack', base_value: 38, damage_type: 'Ice', cost: 700, unlocked: false },

    // ⚡ 번개 검 (Attack)
    { id: 'SWD_05', name: '번개 검', type: 'Attack', base_value: 42, damage_type: 'Lightning', cost: 850, unlocked: false },

    // 🌟 신성 검 (Attack)
    { id: 'SWD_06', name: '신성 검', type: 'Attack', base_value: 50, damage_type: 'Holy', cost: 1000, unlocked: false },

    // 🗡️ 암흑 단검 (Attack)
    { id: 'DGR_02', name: '암흑 단검', type: 'Attack', base_value: 55, damage_type: 'Dark', cost: 1200, unlocked: false },

    // 🏹 긴 활 (Attack)
    { id: 'BOW_01', name: '긴 활', type: 'Attack', base_value: 30, damage_type: 'Physical', cost: 500, unlocked: false },

    // 🏹 엘프의 활 (Attack)
    { id: 'BOW_02', name: '엘프의 활', type: 'Attack', base_value: 45, damage_type: 'Magic', cost: 900, unlocked: false },

    // 🔨 전쟁 망치 (Attack)
    { id: 'HAM_01', name: '전쟁 망치', type: 'Attack', base_value: 60, damage_type: 'Physical', cost: 1400, unlocked: false },

    // 🪄 마법 지팡이 (Attack)
    { id: 'STF_01', name: '마법 지팡이', type: 'Attack', base_value: 48, damage_type: 'Magic', cost: 1100, unlocked: false },

    // 🌙 달빛 지팡이 (Attack)
    { id: 'STF_02', name: '달빛 지팡이', type: 'Attack', base_value: 65, damage_type: 'Magic', cost: 1600, unlocked: false },

    // ⚔️ 영웅의 검 (Attack)
    { id: 'SWD_07', name: '영웅의 검', type: 'Attack', base_value: 75, damage_type: 'Holy', cost: 2000, unlocked: false },

    // 🗡️ 전설의 검 (Attack)
    { id: 'SWD_08', name: '전설의 검', type: 'Attack', base_value: 100, damage_type: 'physical', cost: 3000, unlocked: false },

    // 🛡️ 강철 방패 (Defense)
    { id: 'SHD_02', name: '강철 방패', type: 'Defense', base_value: 10, target: 'Player', cost: 350, unlocked: false },

    // 🛡️ 기사 방패 (Defense)
    { id: 'SHD_03', name: '기사 방패', type: 'Defense', base_value: 15, target: 'Player', cost: 550, unlocked: false },

    // 🛡️ 용의 방패 (Defense)
    { id: 'SHD_04', name: '용의 방패', type: 'Defense', base_value: 20, target: 'Player', cost: 800, unlocked: false },

    // 🛡️ 신성 방패 (Defense)
    { id: 'SHD_05', name: '신성 방패', type: 'Defense', base_value: 25, target: 'Player', cost: 1200, unlocked: false },

    // 🛡️ 영웅의 방패 (Defense)
    { id: 'SHD_06', name: '영웅의 방패', type: 'Defense', base_value: 30, target: 'Player', cost: 1600, unlocked: false },

    // 🛡️ 전설의 방패 (Defense)
    { id: 'SHD_07', name: '전설의 방패', type: 'Defense', base_value: 40, target: 'Player', cost: 2500, unlocked: false },

    // 🎭 가면 (Defense)
    { id: 'MSK_01', name: '전투 가면', type: 'Defense', base_value: 8, target: 'Player', cost: 400, unlocked: false },

    // 🎭 마법 가면 (Defense)
    { id: 'MSK_02', name: '마법 가면', type: 'Defense', base_value: 18, target: 'Player', cost: 1000, unlocked: false },

    // 💰 은화 주머니 (Resource)
    { id: 'RSC_02', name: '은화 주머니', type: 'Resource', base_value: 100, target: 'Player', cost: 200, unlocked: false },

    // 💰 금화 주머니 (Resource)
    { id: 'RSC_03', name: '금화 주머니', type: 'Resource', base_value: 150, target: 'Player', cost: 400, unlocked: false },

    // 💎 보석 (Resource)
    { id: 'RSC_04', name: '보석', type: 'Resource', base_value: 250, target: 'Player', cost: 700, unlocked: false },

    // 💎 루비 (Resource)
    { id: 'RSC_05', name: '루비', type: 'Resource', base_value: 400, target: 'Player', cost: 1200, unlocked: false },

    // 💎 다이아몬드 (Resource)
    { id: 'RSC_06', name: '다이아몬드', type: 'Resource', base_value: 600, target: 'Player', cost: 2000, unlocked: false },

    // 👑 황금 왕관 (Resource)
    { id: 'RSC_07', name: '황금 왕관', type: 'Resource', base_value: 1000, target: 'Player', cost: 3500, unlocked: false }
];

// 💡 ID로 장비 객체를 쉽게 찾기 위한 맵
export const equipmentMap = equipment.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});

// 💡 몬스터 구조
export const monsters = [
    // 초급 몬스터
    {type: 'goblin', icon: '👺', hp: 50, df: 0, atk: 10, attackCount: 1, turnAtkIncrease: 2, tier: 1}, 
    {type: 'slime', icon: '🟢', hp: 80, df: 5, atk: 15, attackCount: 2, turnAtkIncrease: 3, tier: 1},
    {type: 'bat', icon: '🦇', hp: 60, df: 0, atk: 12, attackCount: 3, turnAtkIncrease: 2, tier: 1},
    
    // 중급 몬스터
    {type: 'skeleton', icon: '💀', hp: 120, df: 10, atk: 20, attackCount: 1, turnAtkIncrease: 5, tier: 2},
    {type: 'zombie', icon: '🧟', hp: 150, df: 8, atk: 18, attackCount: 2, turnAtkIncrease: 4, tier: 2},
    {type: 'ghost', icon: '👻', hp: 100, df: 15, atk: 25, attackCount: 2, turnAtkIncrease: 6, tier: 2},
    {type: 'werewolf', icon: '🐺', hp: 180, df: 12, atk: 30, attackCount: 2, turnAtkIncrease: 7, tier: 2},
    
    // 고급 몬스터
    {type: 'orc', icon: '👹', hp: 250, df: 20, atk: 35, attackCount: 2, turnAtkIncrease: 8, tier: 3},
    {type: 'troll', icon: '👾', hp: 300, df: 25, atk: 40, attackCount: 1, turnAtkIncrease: 10, tier: 3},
    {type: 'demon', icon: '😈', hp: 350, df: 30, atk: 45, attackCount: 3, turnAtkIncrease: 12, tier: 3},
    {type: 'vampire', icon: '🧛', hp: 280, df: 28, atk: 50, attackCount: 2, turnAtkIncrease: 11, tier: 3},
    
    // 엘리트 몬스터
    {type: 'dragon', icon: '🐉', hp: 500, df: 40, atk: 60, attackCount: 2, turnAtkIncrease: 15, tier: 4},
    {type: 'hydra', icon: '🐍', hp: 450, df: 35, atk: 55, attackCount: 3, turnAtkIncrease: 13, tier: 4},
    {type: 'phoenix', icon: '🔥', hp: 400, df: 45, atk: 65, attackCount: 2, turnAtkIncrease: 14, tier: 4},
    
    // 전설 몬스터
    {type: 'dark_lord', icon: '🌑', hp: 700, df: 50, atk: 80, attackCount: 3, turnAtkIncrease: 20, tier: 5},
    {type: 'titan', icon: '⚡', hp: 800, df: 60, atk: 90, attackCount: 2, turnAtkIncrease: 22, tier: 5},
    {type: 'ancient_dragon', icon: '🐲', hp: 1000, df: 70, atk: 100, attackCount: 3, turnAtkIncrease: 25, tier: 5}
];
