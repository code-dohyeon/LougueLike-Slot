import goblinImg from '../assets/image/monster/goblin.png';
import darkLordImg from '../assets/image/monster/dark_lord.png';
import dragonImg from '../assets/image/monster/dragon.png';
import demonImg from '../assets/image/monster/demon.png';
import orcImg from '../assets/image/monster/orc.png';
import skeletonImg from '../assets/image/monster/skeleton.png';
import trollImg from '../assets/image/monster/troll.png';
import vampireImg from '../assets/image/monster/vampire.png';
import zombieImg from '../assets/image/monster/zombie.png';
import ghostImg from '../assets/image/monster/ghost.png';
import batImg from '../assets/image/monster/bat.png';
import slimeImg from '../assets/image/monster/slime.png';
import werewolfImg from '../assets/image/monster/werewolf.png';
import phoenixImg from '../assets/image/monster/phoenix.png';
import titanImg from '../assets/image/monster/titan.png';
import hydraImg from '../assets/image/monster/hydra.png';

import goblinKingImg from '../assets/image/monster/goblin_king.png';
import skeletonLordImg from '../assets/image/monster/skeleton_lord.png';
import orcWarlordImg from '../assets/image/monster/orc_warlord.png';
import demonPrinceImg from '../assets/image/monster/demon_prince.png';
import ancientDragonImg from '../assets/image/monster/ancient_dragon.png';
import phoenixQueenImg from '../assets/image/monster/phoenix_queen.png';
import darkEmperorImg from '../assets/image/monster/dark_emperor.png';


import woodSwordImg from '../assets/image/equipment/wood_sword.png';
import poisonDaggerImg from '../assets/image/equipment/poison_dagger.png';
import steelAxeImg from '../assets/image/equipment/iron_axe.png';
import steelSwordImg from '../assets/image/equipment/steel_sword.png';
import fireSwordImg from '../assets/image/equipment/fire_sword.png';
import iceSwordImg from '../assets/image/equipment/ice_sword.png';
import lightningSwordImg from '../assets/image/equipment/lightning_sword.png';
import longArrowImg from '../assets/image/equipment/long_arrow.png';
import elfArrowImg from '../assets/image/equipment/elf_arrow.png';
import hollySwordImg from '../assets/image/equipment/holy_sword.png';
import darkDaggerImg from '../assets/image/equipment/dark_dagger.png';
import warHammerImg from '../assets/image/equipment/war_hammer.png';
import magicWandImg from '../assets/image/equipment/magic_wand.png';
import moonlightWandImg from '../assets/image/equipment/moonlight_wand.png';
import heroSwordImg from '../assets/image/equipment/hero_sword.png';
import legendSwordImg from '../assets/image/equipment/legend_sword.png';
import battleMaskImg from '../assets/image/equipment/battle_mask.png';
import magicMaskImg from '../assets/image/equipment/magic_mask.png';

import woodShieldImg from '../assets/image/equipment/wood_shield.png';
import steelShieldImg from '../assets/image/equipment/steel_shield.png';
import knightShieldImg from '../assets/image/equipment/knight_shield.png';
import dragonShieldImg from '../assets/image/equipment/dragon_shield.png';
import holyShieldImg from '../assets/image/equipment/holy_shield.png';
import heroShieldImg from '../assets/image/equipment/hero_shield.png';
import legendShieldImg from '../assets/image/equipment/legend_shield.png';

import coinImg from '../assets/image/equipment/coin.png';
import silverCoinImg from '../assets/image/equipment/silver_pocket.png';
import goldPocketImg from '../assets/image/equipment/gold_pocket.png';
import gemImg from '../assets/image/equipment/gem.png';
import rubyImg from '../assets/image/equipment/ruby.png';
import diamondImg from '../assets/image/equipment/diamond.png';

export const equipment = [
    // 기본 무기 (무료)
    { id: 'SWD_01', name: '나무 검', type: 'Attack', base_value: 10, damage_type: 'Physical', cost: 0, unlocked: true, requiredLevel: 0, src: woodSwordImg }, 
    { id: 'SHD_01', name: '나무 방패', type: 'Defense', base_value: 4, target: 'Player', cost: 0, unlocked: true, requiredLevel: 0, src: woodShieldImg }, 
    { id: 'RSC_01', name: '코인', type: 'Resource', base_value: 12, target: 'Player', cost: 0, unlocked: true, requiredLevel: 0, src: coinImg }, 
    
    // 레벨 2 해금 무기 (스테이지 1-10)
    { id: 'DGR_01', name: '독 단검', type: 'Attack', base_value: 6, damage_type: 'Poison', cost: 100, unlocked: false, requiredLevel: 1, src: poisonDaggerImg }, 
    { id: 'AXE_01', name: '양날 도끼', type: 'Attack', base_value: 15, damage_type: 'Physical', cost: 200, unlocked: false, requiredLevel: 1, src: steelAxeImg },
    { id: 'SHD_02', name: '강철 방패', type: 'Defense', base_value: 8, target: 'Player', cost: 250, unlocked: false, requiredLevel: 1, src: steelShieldImg },
    { id: 'RSC_02', name: '은화 주머니', type: 'Resource', base_value: 18, target: 'Player', cost: 150, unlocked: false, requiredLevel: 1, src: silverCoinImg },
    
    // 레벨 3 해금 무기 (스테이지 11-20)
    { id: 'SWD_02', name: '강철 검', type: 'Attack', base_value: 18, damage_type: 'Physical', cost: 300, unlocked: false, requiredLevel: 2, src: steelSwordImg },
    { id: 'SWD_03', name: '화염 검', type: 'Attack', base_value: 22, damage_type: 'Fire', cost: 450, unlocked: false, requiredLevel: 2, src: fireSwordImg },
    { id: 'SHD_03', name: '기사 방패', type: 'Defense', base_value: 12, target: 'Player', cost: 400, unlocked: false, requiredLevel: 2, src: knightShieldImg },
    { id: 'RSC_03', name: '금화 주머니', type: 'Resource', base_value: 30, target: 'Player', cost: 300, unlocked: false, requiredLevel: 2, src: goldPocketImg },
    
    // 레벨 5 해금 무기 (스테이지 21-30)
    { id: 'SWD_04', name: '얼음 검', type: 'Attack', base_value: 28, damage_type: 'Ice', cost: 550, unlocked: false, requiredLevel: 4, src: iceSwordImg },
    { id: 'SWD_05', name: '번개 검', type: 'Attack', base_value: 32, damage_type: 'Lightning', cost: 650, unlocked: false, requiredLevel: 4, src: lightningSwordImg },
    { id: 'BOW_01', name: '긴 활', type: 'Attack', base_value: 24, damage_type: 'Physical', cost: 400, unlocked: false, requiredLevel: 4, src: longArrowImg },
    { id: 'SHD_04', name: '용의 방패', type: 'Defense', base_value: 16, target: 'Player', cost: 600, unlocked: false, requiredLevel: 4, src: dragonShieldImg },
    { id: 'RSC_04', name: '보석', type: 'Resource', base_value: 70, target: 'Player', cost: 500, unlocked: false, requiredLevel: 4, src: gemImg },
    
    // 레벨 6 해금 무기 (스테이지 31-40)
    { id: 'SWD_06', name: '신성 검', type: 'Attack', base_value: 38, damage_type: 'Holy', cost: 800, unlocked: false, requiredLevel: 9, src: hollySwordImg },
    { id: 'DGR_02', name: '암흑 단검', type: 'Attack', base_value: 42, damage_type: 'Dark', cost: 900, unlocked: false, requiredLevel: 9, src: darkDaggerImg },
    { id: 'BOW_02', name: '엘프의 활', type: 'Attack', base_value: 35, damage_type: 'Magic', cost: 700, unlocked: false, requiredLevel: 9, src: elfArrowImg },
    { id: 'SHD_05', name: '신성 방패', type: 'Defense', base_value: 20, target: 'Player', cost: 900, unlocked: false, requiredLevel: 9, src: holyShieldImg },
    { id: 'RSC_05', name: '루비', type: 'Resource', base_value: 130, target: 'Player', cost: 850, unlocked: false, requiredLevel: 9, src: rubyImg },
    
    // 레벨 7 해금 무기 (스테이지 41-50)
    { id: 'HAM_01', name: '전쟁 망치', type: 'Attack', base_value: 48, damage_type: 'Physical', cost: 1100, unlocked: false, requiredLevel: 15, src: warHammerImg },
    { id: 'STF_01', name: '마법 지팡이', type: 'Attack', base_value: 40, damage_type: 'Magic', cost: 900, unlocked: false, requiredLevel: 15, src: magicWandImg },
    { id: 'STF_02', name: '달빛 지팡이', type: 'Attack', base_value: 52, damage_type: 'Magic', cost: 1250, unlocked: false, requiredLevel: 15, src: moonlightWandImg },
    { id: 'SHD_06', name: '영웅의 방패', type: 'Defense', base_value: 25, target: 'Player', cost: 1200, unlocked: false, requiredLevel: 15, src: heroShieldImg },
    { id: 'RSC_06', name: '다이아몬드', type: 'Resource', base_value: 170, target: 'Player', cost: 1400, unlocked: false, requiredLevel: 15, src: diamondImg },
    
    // 레벨 9 해금 무기 (스테이지 51-60)
    { id: 'SWD_07', name: '영웅의 검', type: 'Attack', base_value: 60, damage_type: 'Holy', cost: 1600, unlocked: false, requiredLevel: 30, src: heroSwordImg },
    { id: 'SWD_08', name: '전설의 검', type: 'Attack', base_value: 75, damage_type: 'Physical', cost: 2200, unlocked: false, requiredLevel: 30, src: legendSwordImg },
    { id: 'SHD_07', name: '전설의 방패', type: 'Defense', base_value: 32, target: 'Player', cost: 1900, unlocked: false, requiredLevel: 30, src: legendShieldImg },
    { id: 'MSK_01', name: '전투 가면', type: 'Defense', base_value: 6, target: 'Player', cost: 300, unlocked: false, requiredLevel: 30, src: battleMaskImg },
    { id: 'MSK_02', name: '마법 가면', type: 'Defense', base_value: 15, target: 'Player', cost: 750, unlocked: false, requiredLevel: 30, src: magicMaskImg },
    { id: 'RSC_07', name: '황금 왕관', type: 'Resource', base_value: 250, target: 'Player', cost: 2500, unlocked: false, requiredLevel: 30, src: goldPocketImg },
];

// console.log(../assets/image/monster/chapter1/goblin.png);

export const equipmentMap = equipment.reduce((map, item) => {
    map[item.id] = item;
    return map;
}, {});

// 각 챕터의 10번째 스테이지는 보스
export const monsters = [
    // 챕터 1 (스테이지 1-10) - 초급 몬스터
    {type: 'goblin', icon: '👺' ,hp: 40, df: 0, atk: 5, attackCount: 1, turnAtkIncrease: 1, chapter: 1, goldReward: 40, expReward: 5, src: goblinImg }, 
    {type: 'slime', icon: '🟢', hp: 60, goblinImg, df: 2, atk: 5, attackCount: 2, turnAtkIncrease: 2, chapter: 1, goldReward: 50, expReward: 8, src: slimeImg },
    {type: 'bat', icon: '🦇', hp: 50, goblinImg ,df: 0, atk: 7, attackCount: 3, turnAtkIncrease: 1, chapter: 1, goldReward: 45, expReward: 6, src: batImg },
    
    // 챕터 2 (스테이지 11-20) - 중급 몬스터
    {type: 'skeleton', icon: '💀', hp: 95, df: 8, atk: 16, attackCount: 1, turnAtkIncrease: 3, chapter: 2, goldReward: 70, expReward: 10, src: skeletonImg },
    {type: 'zombie', icon: '🧟', hp: 120, df: 6, atk: 14, attackCount: 2, turnAtkIncrease: 2, chapter: 2, goldReward: 75, expReward: 11, src: zombieImg },
    {type: 'ghost', icon: '👻', hp: 80, df: 12, atk: 20, attackCount: 2, turnAtkIncrease: 4, chapter: 2, goldReward: 72, expReward: 13, src: ghostImg },
    
    // 챕터 3 (스테이지 21-30) - 중상급 몬스터
    {type: 'werewolf', icon: '🐺', hp: 145, df: 10, atk: 24, attackCount: 2, turnAtkIncrease: 5, chapter: 3, goldReward: 100, expReward: 20, src: werewolfImg },
    {type: 'orc', icon: '👹', hp: 200, df: 16, atk: 28, attackCount: 2, turnAtkIncrease: 6, chapter: 3, goldReward: 110, expReward: 22, src: orcImg },
    
    // 챕터 4 (스테이지 31-40) - 고급 몬스터
    {type: 'troll', icon: '👾', hp: 240, df: 20, atk: 32, attackCount: 1, turnAtkIncrease: 7, chapter: 4, goldReward: 135, expReward: 25, src: trollImg },
    {type: 'demon', icon: '😈', hp: 280, df: 24, atk: 36, attackCount: 3, turnAtkIncrease: 9, chapter: 4, goldReward: 150, expReward: 28, src: demonImg },
    
    // 챕터 5 (스테이지 41-50) - 엘리트 몬스터
    {type: 'vampire', icon: '🧛', hp: 320, df: 22, atk: 40, attackCount: 2, turnAtkIncrease: 8, chapter: 5, goldReward: 180, expReward: 30, src: vampireImg },
    {type: 'dragon', icon: '🐉', hp: 400, df: 32, atk: 48, attackCount: 2, turnAtkIncrease: 12, chapter: 5, goldReward: 210, expReward: 35, src: dragonImg },
    
    // 챕터 6 (스테이지 51-60) - 전설 몬스터
    {type: 'hydra', icon: '🐍', hp: 360, df: 28, atk: 44, attackCount: 3, turnAtkIncrease: 10, chapter: 6, goldReward: 230, expReward: 40, src: hydraImg },
    {type: 'phoenix', icon: '🔥', hp: 480, df: 36, atk: 52, attackCount: 2, turnAtkIncrease: 11, chapter: 6, goldReward: 250, expReward: 45, src: phoenixImg },
    
    // 챕터 7 (스테이지 61-70) - 신화 몬스터
    {type: 'dark_lord', icon: '🌑', hp: 560, df: 40, atk: 64, attackCount: 3, turnAtkIncrease: 15, chapter: 7, goldReward: 290, expReward: 50, src: darkLordImg },
    {type: 'titan', icon: '⚡', hp: 640, df: 48, atk: 72, attackCount: 2, turnAtkIncrease: 17, chapter: 7, goldReward: 330, expReward: 60, src: titanImg },
];

export const bosses = [
    {type: 'Goblin King', icon: '👑', hp: 160 ,df: 8, atk: 20, attackCount: 2, turnAtkIncrease: 3, chapter: 1, goldReward: 180, expReward: 50, isBoss: true, src: goblinKingImg },
    {type: 'Skeleton Lord', icon: '💀👑', hp: 280 ,df: 16, atk: 32, attackCount: 3, turnAtkIncrease: 6, chapter: 2, goldReward: 260, expReward: 80, isBoss: true, src: skeletonLordImg },
    {type: 'Orc Warlord', icon: '👹👑', hp: 400 ,df: 24, atk: 44, attackCount: 2, turnAtkIncrease: 8, chapter: 3, goldReward: 340, expReward: 120, isBoss: true, src: orcWarlordImg },
    {type: 'Demon Prince', icon: '😈👑', hp: 560 ,df: 32, atk: 56, attackCount: 3, turnAtkIncrease: 12, chapter: 4, goldReward: 420, expReward: 160, isBoss: true, src: demonPrinceImg },
    {type: 'Ancient Dragon', icon: '🐲', hp: 800 ,df: 40, atk: 72, attackCount: 3, turnAtkIncrease: 16, chapter: 5, goldReward: 580, expReward: 200, isBoss: true, src: ancientDragonImg },
    {type: 'Phoenix Queen', icon: '🔥👑', hp: 960 ,df: 48, atk: 80, attackCount: 2, turnAtkIncrease: 20, chapter: 6, goldReward: 750, expReward: 250, isBoss: true, src: phoenixQueenImg },
    {type: 'Dark Emperor', icon: '🌑👑', hp: 1200 ,df: 64, atk: 96, attackCount: 3, turnAtkIncrease: 24, chapter: 7, goldReward: 1000, expReward: 300, isBoss: true, src: darkEmperorImg },
];