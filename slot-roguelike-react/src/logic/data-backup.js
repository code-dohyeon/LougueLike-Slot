export const equipmentBackUp = [
    // 기본 무기 (무료)
    { id: 'SWD_01', name: '나무 검', type: 'Attack', base_value: 100000, damage_type: 'Physical', cost: 0, unlocked: true, requiredLevel: 1 }, 
    { id: 'SHD_01', name: '나무 방패', type: 'Defense', base_value: 4, target: 'Player', cost: 0, unlocked: true, requiredLevel: 1 }, 
    { id: 'RSC_01', name: '코인', type: 'Resource', base_value: 12, target: 'Player', cost: 0, unlocked: true, requiredLevel: 1 }, 
    
    // 레벨 1 해금 무기 (스테이지 1-10)
    { id: 'DGR_01', name: '독 단검', type: 'Attack', base_value: 6, damage_type: 'Poison', cost: 100, unlocked: false, requiredLevel: 2 }, 
    { id: 'AXE_01', name: '양날 도끼', type: 'Attack', base_value: 12, damage_type: 'Physical', cost: 200, unlocked: false, requiredLevel: 2 },
    { id: 'SHD_02', name: '강철 방패', type: 'Defense', base_value: 8, target: 'Player', cost: 250, unlocked: false, requiredLevel: 2 },
    { id: 'RSC_02', name: '은화 주머니', type: 'Resource', base_value: 18, target: 'Player', cost: 150, unlocked: false, requiredLevel: 2 },
    
    // 레벨 2 해금 무기 (스테이지 11-20)
    { id: 'SWD_02', name: '강철 검', type: 'Attack', base_value: 18, damage_type: 'Physical', cost: 300, unlocked: false, requiredLevel: 3 },
    { id: 'SWD_03', name: '화염 검', type: 'Attack', base_value: 22, damage_type: 'Fire', cost: 450, unlocked: false, requiredLevel: 3 },
    { id: 'SHD_03', name: '기사 방패', type: 'Defense', base_value: 12, target: 'Player', cost: 400, unlocked: false, requiredLevel: 3 },
    { id: 'RSC_03', name: '금화 주머니', type: 'Resource', base_value: 30, target: 'Player', cost: 300, unlocked: false, requiredLevel: 3 },
    
    // 레벨 3 해금 무기 (스테이지 21-30)
    { id: 'SWD_04', name: '얼음 검', type: 'Attack', base_value: 28, damage_type: 'Ice', cost: 550, unlocked: false, requiredLevel: 5 },
    { id: 'SWD_05', name: '번개 검', type: 'Attack', base_value: 32, damage_type: 'Lightning', cost: 650, unlocked: false, requiredLevel: 5 },
    { id: 'BOW_01', name: '긴 활', type: 'Attack', base_value: 24, damage_type: 'Physical', cost: 400, unlocked: false, requiredLevel: 5 },
    { id: 'SHD_04', name: '용의 방패', type: 'Defense', base_value: 16, target: 'Player', cost: 600, unlocked: false, requiredLevel: 5 },
    { id: 'RSC_04', name: '보석', type: 'Resource', base_value: 70, target: 'Player', cost: 500, unlocked: false, requiredLevel: 5 },
    
    // 레벨 4 해금 무기 (스테이지 31-40)
    { id: 'SWD_06', name: '신성 검', type: 'Attack', base_value: 38, damage_type: 'Holy', cost: 800, unlocked: false, requiredLevel: 6 },
    { id: 'DGR_02', name: '암흑 단검', type: 'Attack', base_value: 42, damage_type: 'Dark', cost: 900, unlocked: false, requiredLevel: 6 },
    { id: 'BOW_02', name: '엘프의 활', type: 'Attack', base_value: 35, damage_type: 'Magic', cost: 700, unlocked: false, requiredLevel: 6 },
    { id: 'SHD_05', name: '신성 방패', type: 'Defense', base_value: 20, target: 'Player', cost: 900, unlocked: false, requiredLevel: 6 },
    { id: 'RSC_05', name: '루비', type: 'Resource', base_value: 130, target: 'Player', cost: 850, unlocked: false, requiredLevel: 6 },
    
    // 레벨 5 해금 무기 (스테이지 41-50)
    { id: 'HAM_01', name: '전쟁 망치', type: 'Attack', base_value: 48, damage_type: 'Physical', cost: 1100, unlocked: false, requiredLevel: 7 },
    { id: 'STF_01', name: '마법 지팡이', type: 'Attack', base_value: 40, damage_type: 'Magic', cost: 900, unlocked: false, requiredLevel: 7 },
    { id: 'STF_02', name: '달빛 지팡이', type: 'Attack', base_value: 52, damage_type: 'Magic', cost: 1250, unlocked: false, requiredLevel: 7 },
    { id: 'SHD_06', name: '영웅의 방패', type: 'Defense', base_value: 25, target: 'Player', cost: 1200, unlocked: false, requiredLevel: 7 },
    { id: 'RSC_06', name: '다이아몬드', type: 'Resource', base_value: 170, target: 'Player', cost: 1400, unlocked: false, requiredLevel: 7 },
    
    // 레벨 6 해금 무기 (스테이지 51-60)
    { id: 'SWD_07', name: '영웅의 검', type: 'Attack', base_value: 60, damage_type: 'Holy', cost: 1600, unlocked: false, requiredLevel: 9 },
    { id: 'SWD_08', name: '전설의 검', type: 'Attack', base_value: 75, damage_type: 'Physical', cost: 2200, unlocked: false, requiredLevel: 9 },
    { id: 'SHD_07', name: '전설의 방패', type: 'Defense', base_value: 32, target: 'Player', cost: 1900, unlocked: false, requiredLevel: 9 },
    { id: 'MSK_01', name: '전투 가면', type: 'Defense', base_value: 6, target: 'Player', cost: 300, unlocked: false, requiredLevel: 9 },
    { id: 'MSK_02', name: '마법 가면', type: 'Defense', base_value: 15, target: 'Player', cost: 750, unlocked: false, requiredLevel: 9 },
    { id: 'RSC_07', name: '황금 왕관', type: 'Resource', base_value: 250, target: 'Player', cost: 2500, unlocked: false, requiredLevel: 9 }
];

export const equipmentMap = equipmentBackUp.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});

// 각 챕터의 10번째 스테이지는 보스
export const monsters = [
    // 챕터 1 (스테이지 1-10) - 초급 몬스터
    {type: 'goblin', icon: '👺', hp: 40, df: 0, atk: 5, attackCount: 1, turnAtkIncrease: 1, chapter: 1, goldReward: 40, expReward: 5}, 
    {type: 'slime', icon: '🟢', hp: 65, df: 3, atk: 8, attackCount: 2, turnAtkIncrease: 2, chapter: 1, goldReward: 50, expReward: 6},
    {type: 'bat', icon: '🦇', hp: 50, df: 0, atk: 7, attackCount: 3, turnAtkIncrease: 1, chapter: 1, goldReward: 45, expReward: 7},
    
    // 챕터 2 (스테이지 11-20) - 중급 몬스터
    {type: 'skeleton', icon: '💀', hp: 95, df: 8, atk: 16, attackCount: 1, turnAtkIncrease: 3, chapter: 2, goldReward: 70, expReward: 10},
    {type: 'zombie', icon: '🧟', hp: 120, df: 6, atk: 14, attackCount: 2, turnAtkIncrease: 2, chapter: 2, goldReward: 75, expReward: 11},
    {type: 'ghost', icon: '👻', hp: 80, df: 12, atk: 20, attackCount: 2, turnAtkIncrease: 4, chapter: 2, goldReward: 72, expReward: 13},
    
    // 챕터 3 (스테이지 21-30) - 중상급 몬스터
    {type: 'werewolf', icon: '🐺', hp: 145, df: 10, atk: 24, attackCount: 2, turnAtkIncrease: 5, chapter: 3, goldReward: 100, expReward: 20},
    {type: 'orc', icon: '👹', hp: 200, df: 16, atk: 28, attackCount: 2, turnAtkIncrease: 6, chapter: 3, goldReward: 110, expReward: 22},
    
    // 챕터 4 (스테이지 31-40) - 고급 몬스터
    {type: 'troll', icon: '👾', hp: 240, df: 20, atk: 32, attackCount: 1, turnAtkIncrease: 7, chapter: 4, goldReward: 135, expReward: 25},
    {type: 'demon', icon: '😈', hp: 280, df: 24, atk: 36, attackCount: 3, turnAtkIncrease: 9, chapter: 4, goldReward: 150, expReward: 28},
    
    // 챕터 5 (스테이지 41-50) - 엘리트 몬스터
    {type: 'vampire', icon: '🧛', hp: 320, df: 22, atk: 40, attackCount: 2, turnAtkIncrease: 8, chapter: 5, goldReward: 180, expReward: 30},
    {type: 'dragon', icon: '🐉', hp: 400, df: 32, atk: 48, attackCount: 2, turnAtkIncrease: 12, chapter: 5, goldReward: 210, expReward: 35},
    
    // 챕터 6 (스테이지 51-60) - 전설 몬스터
    {type: 'hydra', icon: '🐍', hp: 360, df: 28, atk: 44, attackCount: 3, turnAtkIncrease: 10, chapter: 6, goldReward: 230, expReward: 40},
    {type: 'phoenix', icon: '🔥', hp: 480, df: 36, atk: 52, attackCount: 2, turnAtkIncrease: 11, chapter: 6, goldReward: 250, expReward: 45},
    
    // 챕터 7 (스테이지 61-70) - 신화 몬스터
    {type: 'dark_lord', icon: '🌑', hp: 560, df: 40, atk: 64, attackCount: 3, turnAtkIncrease: 15, chapter: 7, goldReward: 290, expReward: 50},
    {type: 'titan', icon: '⚡', hp: 640, df: 48, atk: 72, attackCount: 2, turnAtkIncrease: 17, chapter: 7, goldReward: 330, expReward: 60},
];

export const bosses = [
    {type: 'Goblin King', icon: '👑', hp: 160, df: 8, atk: 20, attackCount: 2, turnAtkIncrease: 3, chapter: 1, goldReward: 180, expReward: 50, isBoss: true},
    {type: 'Skeleton Lord', icon: '💀👑', hp: 280, df: 16, atk: 32, attackCount: 3, turnAtkIncrease: 6, chapter: 2, goldReward: 260, expReward: 80, isBoss: true},
    {type: 'Orc Warlord', icon: '👹👑', hp: 400, df: 24, atk: 44, attackCount: 2, turnAtkIncrease: 8, chapter: 3, goldReward: 340, expReward: 120, isBoss: true},
    {type: 'Demon Prince', icon: '😈👑', hp: 560, df: 32, atk: 56, attackCount: 3, turnAtkIncrease: 12, chapter: 4, goldReward: 420, expReward: 160, isBoss: true},
    {type: 'Ancient Dragon', icon: '🐲', hp: 800, df: 40, atk: 72, attackCount: 3, turnAtkIncrease: 16, chapter: 5, goldReward: 580, expReward: 200, isBoss: true},
    {type: 'Phoenix Queen', icon: '🔥👑', hp: 960, df: 48, atk: 80, attackCount: 2, turnAtkIncrease: 20, chapter: 6, goldReward: 750, expReward: 250, isBoss: true},
    {type: 'Dark Emperor', icon: '🌑👑', hp: 1200, df: 64, atk: 96, attackCount: 3, turnAtkIncrease: 24, chapter: 7, goldReward: 1000, expReward: 300, isBoss: true},
];
