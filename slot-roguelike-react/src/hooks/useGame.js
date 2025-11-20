import { useState, useMemo, useCallback } from 'react';
import GameManager from '../logic/gameManager';
import { equipment } from '../logic/data'; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SPIN_DURATION = 800;
const RESULT_SHOW_DELAY = 300;
const ACTION_DELAY = 200;
const MONSTER_TURN_DELAY = 400;
const DEATH_DELAY = 800;

export const useGame = () => {
    const game = useMemo(() => new GameManager(), []);
    
    const [gameState, setGameState] = useState(game.gameState);
    const [playerState, setPlayerState] = useState({ ...game.player });
    const [monsterState, setMonsterState] = useState(game.currentMonster ? { ...game.currentMonster } : null);
    const [stage, setStage] = useState(game.stage);
    const [slotResults, setSlotResults] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [shopInventory, setShopInventory] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    
    const [currentlyProcessingSlotIndex, setCurrentlyProcessingSlotIndex] = useState(-1);
    const [monsterDamagePopups, setMonsterDamagePopups] = useState([]);
    const [playerDamagePopups, setPlayerDamagePopups] = useState([]);
    const [resourcePopups, setResourcePopups] = useState([]);
    const [showInventory, setShowInventory] = useState(false);
// 💡 콤보 이펙트 상태 추가
    const [comboTriggered, setComboTriggered] = useState(false);

    const syncGameState = () => {
        setGameState(game.gameState);
        setPlayerState({ ...game.player });
        setMonsterState(game.currentMonster ? { ...game.currentMonster } : null);
        setStage(game.stage);
        setShopInventory([...game.shopInventory]);
    };

    const startPlayerTurn = useCallback(async () => {
        if (isSpinning || isBlocked || gameState !== 'Combat') return;
        
        setIsSpinning(true);
        setIsBlocked(true);
        setComboTriggered(false); // 💡 새 턴 시작 시 콤보 상태 초기화

        try {
            setSlotResults(null);
            setCurrentlyProcessingSlotIndex(-1);
            
            const results = game.slotMachine.spin(game.player.slotCount);
            const multiplier = game.calculateMultiplier(results);

            await delay(SPIN_DURATION);

            setSlotResults(results);
            setIsSpinning(false);
            await delay(RESULT_SHOW_DELAY);

            for (let i = 0; i < results.length; i++) {
                setCurrentlyProcessingSlotIndex(i);
                
                const itemResult = results[i];
                const result = game.processSingleSlotResult(itemResult, multiplier);
                
                syncGameState();
                
                if(itemResult['type'] === 'Attack') {
                    const popups = [];
                    
                    if (result.physicalDamage > 0) {
                        popups.push({ id: Date.now() + Math.random(), value: Math.floor(result.physicalDamage), type: 'physical' });
                    }
                    if (result.poisonDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.1, value: Math.floor(result.poisonDamage), type: 'poison' });
                    }
                    if (result.fireDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.2, value: Math.floor(result.fireDamage), type: 'fire' });
                    }
                    if (result.iceDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.3, value: Math.floor(result.iceDamage), type: 'ice' });
                    }
                    if (result.lightningDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.4, value: Math.floor(result.lightningDamage), type: 'lightning' });
                    }
                    if (result.holyDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.5, value: Math.floor(result.holyDamage), type: 'holy' });
                    }
                    if (result.darkDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.6, value: Math.floor(result.darkDamage), type: 'dark' });
                    }
                    if (result.magicDamage > 0) {
                        popups.push({ id: Date.now() + Math.random() + 0.7, value: Math.floor(result.magicDamage), type: 'magic' });
                    }
                    
                    if (popups.length > 0) {
                        setMonsterDamagePopups(popups);
                    }
                } else if (itemResult['type'] === 'Defense') {
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(result.defenseGain), 
                        type: 'defense' 
                    }]);
                } else if (itemResult['type'] === 'Resource') {
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(result.goldGain), 
                        type: 'gold' 
                    }]);
                }

                if (game.currentMonster && game.currentMonster.hp <= 0) {
                    await delay(DEATH_DELAY);
                    game.handleMonsterDefeat();
                    syncGameState();
                    setCurrentlyProcessingSlotIndex(-1);
                    setMonsterDamagePopups([]);
                    setResourcePopups([]);
                    setIsBlocked(false);
                    return;
                }

                await delay(ACTION_DELAY);
                setMonsterDamagePopups([]);
                setResourcePopups([]);
                // 💡 콤보 체크 로직 추가: 마지막 슬롯 처리 후
                if (i === results.length - 1) {
                    // game.js에 콤보 체크 로직이 있다고 가정
                    // 예시: game.checkCombo(results)가 콤보 성공 여부를 bool 값으로 반환한다고 가정
                    if (game.checkCombo(results)) { // 💥 gameManager.js에 checkCombo 함수가 필요합니다.
                        setComboTriggered(true); // 콤보 성공!
                    }
                }
            }
            
            setCurrentlyProcessingSlotIndex(-1);
            
            

            if (game.gameState === 'Combat') {
                await delay(MONSTER_TURN_DELAY);
                
                // 💡 수정: damageReport에 기본값 { Poison: 0, Fire: 0 }을 설정
                const { 
                    damageTaken, 
                    status: monsterStatus, 
                    poisonDamage, 
                    shieldAbsorbed, 
                    skippedTurn, 
                    isFrozenSkip,
                    damageReport = { Poison: 0, Fire: 0 } // <-- 이 부분을 추가/수정
                } = game.monsterAttack();
                
                syncGameState();

                if (monsterStatus === 'win') {
                    setIsBlocked(false);
                    return;
                }

                // --- 턴 스킵 로직 ---
                if (skippedTurn) { 
                    // 💥 몬스터 턴 스킵 시 Frozen 이펙트 표시 로직 추가 💥
                    
                    // 턴 스킵 시에도 도트딜 팝업을 속성별로 표시
                    if (damageReport.Poison > 0 || damageReport.Fire > 0) { 
                        const dotPopups = [];
                        // 1. 독 데미지 팝업
                        if (damageReport.Poison > 0) dotPopups.push({ id: Date.now() + 0.1, value: damageReport.Poison, type: 'poison' });
                        // 2. 🔥 불 데미지 팝업: type을 'fire'로 정확하게 지정
                        if (damageReport.Fire > 0) dotPopups.push({ id: Date.now() + 0.2, value: damageReport.Fire, type: 'fire' }); 
                        setMonsterDamagePopups(dotPopups); 
                        await delay(600);
                        setMonsterDamagePopups([]);
                    }
                    
                    if (game.currentMonster && game.currentMonster.hp <= 0) {
                        await delay(DEATH_DELAY);
                        game.handleMonsterDefeat();
                        syncGameState();
                        setIsBlocked(false);
                        return;
                    }
                    
                    // 턴 스킵 시에는 물리 공격을 건너뛰고 다음 턴으로
                    setIsBlocked(false);
                    return;
                }

                // --- 턴 스킵이 아닐 때 로직 ---
                if (damageReport.Poison > 0 || damageReport.Fire > 0) {
                    const dotPopups = [];
                    // 1. 독 데미지 팝업
                    if (damageReport.Poison > 0) dotPopups.push({ id: Date.now() + 0.1, value: damageReport.Poison, type: 'poison' });
                    // 2. 🔥 불 데미지 팝업: type을 'fire'로 정확하게 지정
                    if (damageReport.Fire > 0) dotPopups.push({ id: Date.now() + 0.2, value: damageReport.Fire, type: 'fire' });
                    setMonsterDamagePopups(dotPopups); 
                    await delay(600);
                    setMonsterDamagePopups([]);
                    
                    if (game.currentMonster && game.currentMonster.hp <= 0) {
                        await delay(DEATH_DELAY);
                        game.handleMonsterDefeat();
                        syncGameState();
                        setIsBlocked(false);
                        return;
                    }
                }

                if (monsterStatus === 'win') {
                    setIsBlocked(false);
                    return;
                }
                
                if (shieldAbsorbed > 0) {
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(shieldAbsorbed), 
                        type: 'shield-lost' 
                    }]);
                    await delay(400);
                    setResourcePopups([]);
                }
                
                if (damageTaken > 0) {
                    const playerPopup = { id: Date.now(), value: damageTaken, type: 'physical' };
                    setPlayerDamagePopups([playerPopup]);
                    await delay(800);
                    setPlayerDamagePopups([]);
                }
                
                syncGameState();
                
                if (monsterStatus === 'lose') {
                    await delay(DEATH_DELAY);
                    setGameState('GameOver');
                    setIsBlocked(false);
                    return;
                }
            }

        } catch (error) {
            console.error("Error during spin:", error);
        } finally {
            setIsSpinning(false);
            setIsBlocked(false);
        }

        return {
            comboTriggered,
            setComboTriggered,
            monsterDamagePopups,
            playerDamagePopups,
            resourcePopups,
            currentlyProcessingSlotIndex,
        }
    }, [gameState, isSpinning, isBlocked, game]);

    const goToNextStage = () => {
        game.gameState = 'Combat';
        game.prepareNextCombat();
        setSlotResults(null);
        syncGameState();
    };

    const restartGame = () => {
        window.location.reload();
    };
    
    const setInitialWeapons = (itemIds) => {
        game.setInitialWeapons(itemIds);
        syncGameState();
    }
    
    const upgradeMaxHp = () => {
        if (game.player.gold >= 50) {
            game.player.gold -= 50;
            game.player.maxHP += 10;
            game.player.hp = game.player.maxHP;
            
            alert("최대 HP가 10 증가하고 HP가 모두 회복되었습니다!");
            syncGameState();
        } else {
            alert("골드가 부족합니다!");
        }
    };

    const upgradeSlotCount = () => {
        if (game.player.slotCount < 5 && game.player.gold >= 500) {
            game.player.gold -= 500;
            game.player.slotCount++;

            alert(`슬롯 개수가 ${game.player.slotCount}개로 증가했습니다!`);
            syncGameState();
        } else if(game.player.slotCount >= 5) {
            alert("이미 최대 슬롯 개수입니다!");
        } else {
            alert("골드가 부족합니다!");
        }
    };

    const getShopItems = () => {
        return game.allEquipment;
    };

    const getShopInventory = () => {
        return game.shopInventory;
    };

    const handleBuyWeapon = (itemId) => {
        const result = game.buyAndEquipWeapon(itemId);
        
        if (result.success) {
            alert(result.message);
            syncGameState();
        } else {
            alert(`구매 실패: ${result.message}`);
        }
        return result.success;
    };

    const handleSellWeapon = (itemId) => {
        const result = game.sellWeapon(itemId);
        
        if (result.success) {
            alert(result.message);
            syncGameState();
        } else {
            alert(`판매 실패: ${result.message}`);
        }
        return result.success;
    };

    const handleRefreshShop = () => {
        const result = game.refreshShop(50);
        
        if (result.success) {
            alert(result.message);
            syncGameState();
        } else {
            alert(result.message);
        }
    };

    const handleUpgradeWeapon = (weaponId) => {
        const result = game.upgradeWeapon(weaponId);
        
        if (result.success) {
            alert(result.message);
            syncGameState();
        } else {
            alert(result.message);
        }
        return result.success;
    };

    const toggleInventory = () => {
        setShowInventory(!showInventory);
    };

    return {
        game,
        gameState,
        playerState,
        monsterState,
        stage,
        slotResults,
        isSpinning,
        isBlocked,
        startPlayerTurn,
        goToNextStage,
        restartGame,
        setInitialWeapons,
        upgradeMaxHp,
        upgradeSlotCount,
        getShopItems,
        getShopInventory,
        handleBuyWeapon,
        handleSellWeapon,
        handleRefreshShop,
        handleUpgradeWeapon,
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups,
        resourcePopups,
        showInventory,
        toggleInventory,
    };
};