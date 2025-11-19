export const equipment = [
    { id: 'SWD_01', name: '나무 검', type: 'Attack', base_value: 10, damage_type: 'Physical', cost: 0, unlocked: true, requiredLevel: 0 }, 
    { id: 'SHD_01', name: '나무 방패', type: 'Defense', base_value: 5, target: 'Player', cost: 0, unlocked: true, requiredLevel: 0 }, 
    { id: 'RSC_01', name: '코인', type: 'Resource', base_value: 50, target: 'Player', cost: 0, unlocked: true, requiredLevel: 0 }, 
    
    // 레벨 1 해금 무기 (스테이지 1-10 클리어 후)
    { id: 'DGR_01', name: '독 단검', type: 'Attack', base_value: 4, damage_type: 'Poison', cost: 150, unlocked: false, requiredLevel: 1 }, 
    { id: 'AXE_01', name: '양날 도끼', type: 'Attack', base_value: 15, damage_type: 'Physical', cost: 300, unlocked: false, requiredLevel: 1 },
    { id: 'SHD_02', name: '강철 방패', type: 'Defense', base_value: 10, target: 'Player', cost: 350, unlocked: false, requiredLevel: 1 },
    { id: 'RSC_02', name: '은화 주머니', type: 'Resource', base_value: 100, target: 'Player', cost: 200, unlocked: false, requiredLevel: 1 },
    
    // 레벨 2 해금 무기 (스테이지 11-20 클리어 후)
    { id: 'SWD_02', name: '강철 검', type: 'Attack', base_value: 25, damage_type: 'Physical', cost: 400, unlocked: false, requiredLevel: 2 },
    { id: 'SWD_03', name: '화염 검', type: 'Attack', base_value: 35, damage_type: 'Fire', cost: 600, unlocked: false, requiredLevel: 2 },
    { id: 'SHD_03', name: '기사 방패', type: 'Defense', base_value: 15, target: 'Player', cost: 550, unlocked: false, requiredLevel: 2 },
    { id: 'RSC_03', name: '금화 주머니', type: 'Resource', base_value: 150, target: 'Player', cost: 400, unlocked: false, requiredLevel: 2 },
    
    // 레벨 3 해금 무기 (스테이지 21-30 클리어 후)
    { id: 'SWD_04', name: '얼음 검', type: 'Attack', base_value: 38, damage_type: 'Ice', cost: 700, unlocked: false, requiredLevel: 3 },
    { id: 'SWD_05', name: '번개 검', type: 'Attack', base_value: 42, damage_type: 'Lightning', cost: 850, unlocked: false, requiredLevel: 3 },
    { id: 'BOW_01', name: '긴 활', type: 'Attack', base_value: 30, damage_type: 'Physical', cost: 500, unlocked: false, requiredLevel: 3 },
    { id: 'SHD_04', name: '용의 방패', type: 'Defense', base_value: 20, target: 'Player', cost: 800, unlocked: false, requiredLevel: 3 },
    { id: 'RSC_04', name: '보석', type: 'Resource', base_value: 250, target: 'Player', cost: 700, unlocked: false, requiredLevel: 3 },
    
    // 레벨 4 해금 무기 (스테이지 31-40 클리어 후)
    { id: 'SWD_06', name: '신성 검', type: 'Attack', base_value: 50, damage_type: 'Holy', cost: 1000, unlocked: false, requiredLevel: 4 },
    { id: 'DGR_02', name: '암흑 단검', type: 'Attack', base_value: 55, damage_type: 'Dark', cost: 1200, unlocked: false, requiredLevel: 4 },
    { id: 'BOW_02', name: '엘프의 활', type: 'Attack', base_value: 45, damage_type: 'Magic', cost: 900, unlocked: false, requiredLevel: 4 },
    { id: 'SHD_05', name: '신성 방패', type: 'Defense', base_value: 25, target: 'Player', cost: 1200, unlocked: false, requiredLevel: 4 },
    { id: 'RSC_05', name: '루비', type: 'Resource', base_value: 400, target: 'Player', cost: 1200, unlocked: false, requiredLevel: 4 },
    
    // 레벨 5 해금 무기 (스테이지 41-50 클리어 후)
    { id: 'HAM_01', name: '전쟁 망치', type: 'Attack', base_value: 60, damage_type: 'Physical', cost: 1400, unlocked: false, requiredLevel: 5 },
    { id: 'STF_01', name: '마법 지팡이', type: 'Attack', base_value: 48, damage_type: 'Magic', cost: 1100, unlocked: false, requiredLevel: 5 },
    { id: 'STF_02', name: '달빛 지팡이', type: 'Attack', base_value: 65, damage_type: 'Magic', cost: 1600, unlocked: false, requiredLevel: 5 },
    { id: 'SHD_06', name: '영웅의 방패', type: 'Defense', base_value: 30, target: 'Player', cost: 1600, unlocked: false, requiredLevel: 5 },
    { id: 'RSC_06', name: '다이아몬드', type: 'Resource', base_value: 600, target: 'Player', cost: 2000, unlocked: false, requiredLevel: 5 },
    
    // 레벨 6 해금 무기 (스테이지 51-60 클리어 후)
    { id: 'SWD_07', name: '영웅의 검', type: 'Attack', base_value: 75, damage_type: 'Holy', cost: 2000, unlocked: false, requiredLevel: 6 },
    { id: 'SWD_08', name: '전설의 검', type: 'Attack', base_value: 100, damage_type: 'Physical', cost: 3000, unlocked: false, requiredLevel: 6 },
    { id: 'SHD_07', name: '전설의 방패', type: 'Defense', base_value: 40, target: 'Player', cost: 2500, unlocked: false, requiredLevel: 6 },
    { id: 'MSK_01', name: '전투 가면', type: 'Defense', base_value: 8, target: 'Player', cost: 400, unlocked: false, requiredLevel: 6 },
    { id: 'MSK_02', name: '마법 가면', type: 'Defense', base_value: 18, target: 'Player', cost: 1000, unlocked: false, requiredLevel: 6 },
    { id: 'RSC_07', name: '황금 왕관', type: 'Resource', base_value: 1000, target: 'Player', cost: 3500, unlocked: false, requiredLevel: 6 }
];

export const equipmentMap = equipment.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});

// 각 챕터의 10번째 스테이지는 보스
export const monsters = [
    // 챕터 1 (스테이지 1-10) - 초급 몬스터
    {type: 'goblin', icon: '👺', hp: 50, df: 0, atk: 10, attackCount: 1, turnAtkIncrease: 2, chapter: 1, goldReward: 50, expReward: 10}, 
    {type: 'slime', icon: '🟢', hp: 80, df: 5, atk: 15, attackCount: 2, turnAtkIncrease: 3, chapter: 1, goldReward: 60, expReward: 12},
    {type: 'bat', icon: '🦇', hp: 60, df: 0, atk: 12, attackCount: 3, turnAtkIncrease: 2, chapter: 1, goldReward: 55, expReward: 11},
    
    // 챕터 2 (스테이지 11-20) - 중급 몬스터
    {type: 'skeleton', icon: '💀', hp: 120, df: 10, atk: 20, attackCount: 1, turnAtkIncrease: 5, chapter: 2, goldReward: 80, expReward: 15},
    {type: 'zombie', icon: '🧟', hp: 150, df: 8, atk: 18, attackCount: 2, turnAtkIncrease: 4, chapter: 2, goldReward: 90, expReward: 16},
    {type: 'ghost', icon: '👻', hp: 100, df: 15, atk: 25, attackCount: 2, turnAtkIncrease: 6, chapter: 2, goldReward: 85, expReward: 17},
    
    // 챕터 3 (스테이지 21-30) - 중상급 몬스터
    {type: 'werewolf', icon: '🐺', hp: 180, df: 12, atk: 30, attackCount: 2, turnAtkIncrease: 7, chapter: 3, goldReward: 120, expReward: 20},
    {type: 'orc', icon: '👹', hp: 250, df: 20, atk: 35, attackCount: 2, turnAtkIncrease: 8, chapter: 3, goldReward: 130, expReward: 22},
    
    // 챕터 4 (스테이지 31-40) - 고급 몬스터
    {type: 'troll', icon: '👾', hp: 300, df: 25, atk: 40, attackCount: 1, turnAtkIncrease: 10, chapter: 4, goldReward: 160, expReward: 25},
    {type: 'demon', icon: '😈', hp: 350, df: 30, atk: 45, attackCount: 3, turnAtkIncrease: 12, chapter: 4, goldReward: 180, expReward: 28},
    
    // 챕터 5 (스테이지 41-50) - 엘리트 몬스터
    {type: 'vampire', icon: '🧛', hp: 400, df: 28, atk: 50, attackCount: 2, turnAtkIncrease: 11, chapter: 5, goldReward: 220, expReward: 30},
    {type: 'dragon', icon: '🐉', hp: 500, df: 40, atk: 60, attackCount: 2, turnAtkIncrease: 15, chapter: 5, goldReward: 250, expReward: 35},
    
    // 챕터 6 (스테이지 51-60) - 전설 몬스터
    {type: 'hydra', icon: '🐍', hp: 450, df: 35, atk: 55, attackCount: 3, turnAtkIncrease: 13, chapter: 6, goldReward: 280, expReward: 40},
    {type: 'phoenix', icon: '🔥', hp: 600, df: 45, atk: 65, attackCount: 2, turnAtkIncrease: 14, chapter: 6, goldReward: 300, expReward: 45},
    
    // 챕터 7 (스테이지 61-70) - 신화 몬스터
    {type: 'dark_lord', icon: '🌑', hp: 700, df: 50, atk: 80, attackCount: 3, turnAtkIncrease: 20, chapter: 7, goldReward: 350, expReward: 50},
    {type: 'titan', icon: '⚡', hp: 800, df: 60, atk: 90, attackCount: 2, turnAtkIncrease: 22, chapter: 7, goldReward: 400, expReward: 60},
];

export const bosses = [
    {type: 'Goblin King', icon: '👑', hp: 200, df: 10, atk: 25, attackCount: 2, turnAtkIncrease: 5, chapter: 1, goldReward: 200, expReward: 50, isBoss: true},
    {type: 'Skeleton Lord', icon: '💀👑', hp: 350, df: 20, atk: 40, attackCount: 3, turnAtkIncrease: 8, chapter: 2, goldReward: 300, expReward: 80, isBoss: true},
    {type: 'Orc Warlord', icon: '👹👑', hp: 500, df: 30, atk: 55, attackCount: 2, turnAtkIncrease: 10, chapter: 3, goldReward: 400, expReward: 120, isBoss: true},
    {type: 'Demon Prince', icon: '😈👑', hp: 700, df: 40, atk: 70, attackCount: 3, turnAtkIncrease: 15, chapter: 4, goldReward: 500, expReward: 160, isBoss: true},
    {type: 'Ancient Dragon', icon: '🐲', hp: 1000, df: 50, atk: 90, attackCount: 3, turnAtkIncrease: 20, chapter: 5, goldReward: 700, expReward: 200, isBoss: true},
    {type: 'Phoenix Queen', icon: '🔥👑', hp: 1200, df: 60, atk: 100, attackCount: 2, turnAtkIncrease: 25, chapter: 6, goldReward: 900, expReward: 250, isBoss: true},
    {type: 'Dark Emperor', icon: '🌑👑', hp: 1500, df: 80, atk: 120, attackCount: 3, turnAtkIncrease: 30, chapter: 7, goldReward: 1200, expReward: 300, isBoss: true},
];
