import { useState, useMemo, useCallback } from 'react';
import GameManager from '../logic/gameManager'; 
import React from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SPIN_DURATION = 800;
const RESULT_SHOW_DELAY = 300;
const ACTION_DELAY = 200;
const MONSTER_TURN_DELAY = 800;

export const useGame = () => {
    const game = useMemo(() => new GameManager(), []);
    
    const [gameState, setGameState] = useState(game.gameState);
    const [playerState, setPlayerState] = useState({ ...game.player });
    const [monsterState, setMonsterState] = useState(game.currentMonster ? { ...game.currentMonster } : null);
    const [stage, setStage] = useState(game.stage);
    const [slotResults, setSlotResults] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    
    const [currentlyProcessingSlotIndex, setCurrentlyProcessingSlotIndex] = useState(-1);
    const [monsterDamagePopups, setMonsterDamagePopups] = useState([]);
    const [playerDamagePopups, setPlayerDamagePopups] = useState([]);
    const [resourcePopups, setResourcePopups] = useState([]); // 골드/방어력 팝업
    const [showInventory, setShowInventory] = useState(false);

    const syncGameState = () => {
        setGameState(game.gameState);
        setPlayerState({ ...game.player });
        setMonsterState(game.currentMonster ? { ...game.currentMonster } : null);
        setStage(game.stage);
    };

    const startPlayerTurn = useCallback(async () => {
        if (isSpinning || gameState !== 'Combat') return;
        setIsSpinning(true);

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
                    // 방어력 획득 팝업
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(result.defenseGain), 
                        type: 'defense' 
                    }]);
                } else if (itemResult['type'] === 'Resource') {
                    // 골드 획득 팝업
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(result.goldGain), 
                        type: 'gold' 
                    }]);
                }

                if (game.currentMonster && game.currentMonster.hp <= 0) {
                    game.handleMonsterDefeat();
                    syncGameState();
                    setCurrentlyProcessingSlotIndex(-1);
                    setMonsterDamagePopups([]);
                    setResourcePopups([]);
                    return;
                }

                await delay(ACTION_DELAY);
                setMonsterDamagePopups([]);
                setResourcePopups([]);
            }
            
            setCurrentlyProcessingSlotIndex(-1);
            
            if (game.gameState === 'Combat') {
                await delay(MONSTER_TURN_DELAY);
                
                const { damageTaken, status: monsterStatus, poisonDamage, shieldAbsorbed } = game.monsterAttack();
                syncGameState();

                if (poisonDamage > 0) {
                    setMonsterDamagePopups([{ id: Date.now(), value: poisonDamage, type: 'poison' }]);
                    await delay(600);
                    setMonsterDamagePopups([]);
                }

                if (monsterStatus === 'win') {
                    return;
                }
                
                // 쉴드 감소 팝업
                if (shieldAbsorbed > 0) {
                    setResourcePopups([{ 
                        id: Date.now(), 
                        value: Math.floor(shieldAbsorbed), 
                        type: 'shield-lost' 
                    }]);
                    await delay(400);
                    setResourcePopups([]);
                }
                
                // 플레이어 피해 팝업
                if (damageTaken > 0) {
                    const playerPopup = { id: Date.now(), value: damageTaken, type: 'physical' };
                    setPlayerDamagePopups([playerPopup]);
                    await delay(800);
                    setPlayerDamagePopups([]);
                }
                
                syncGameState();
                
                if (monsterStatus === 'lose') {
                    setGameState('GameOver');
                    return;
                }
            }

        } catch (error) {
            console.error("Error during spin:", error);
        } finally {
            setIsSpinning(false);
        }
    }, [gameState, isSpinning, game]);

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
        if (game.player.slotCount < 5 && game.player.gold >= 100) {
            game.player.gold -= 100;
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

    const handleBuyWeapon = (itemId) => {
        const result = game.buyAndEquipWeapon(itemId);
        
        if (result.success) {
            alert(result.message);
        } else {
            alert(`구매 실패: ${result.message}`);
        }
        syncGameState();
        return result.success;
    };

    const handleSellWeapon = (itemId) => {
        const result = game.sellWeapon(itemId);
        
        if (result.success) {
            alert(result.message);
        } else {
            alert(`판매 실패: ${result.message}`);
        }
        syncGameState();
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
        startPlayerTurn,
        goToNextStage,
        restartGame,
        setInitialWeapons,
        upgradeMaxHp,
        upgradeSlotCount,
        getShopItems,
        handleBuyWeapon,
        handleSellWeapon,
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups,
        resourcePopups,
        showInventory,
        toggleInventory,
    };
};