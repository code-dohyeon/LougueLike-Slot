import { useState, useMemo, useCallback } from 'react';
import GameManager from '../logic/gameManager'; 
import React from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PLAYER_TURN_DELAY = 1000;
const MONSTER_TURN_DELAY = 1000; 
const ACTION_DELAY = 500;

export const useGame = () => {
    const game = useMemo(() => new GameManager(), []);
    
    const [damagePopups, setDamagePopups] = useState([]);
    
    const [gameState, setGameState] = useState(game.gameState);
    const [playerState, setPlayerState] = useState({ ...game.player });
    const [monsterState, setMonsterState] = useState(game.currentMonster ? { ...game.currentMonster } : null);
    const [stage, setStage] = useState(game.stage);
    const [slotResults, setSlotResults] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [damageTaken, setDamageTaken] = useState(0);
    
    const [currentlyProcessingSlotIndex, setCurrentlyProcessingSlotIndex] = useState(-1);
    const [monsterDamagePopups, setMonsterDamagePopups] = useState([]);
    const [playerDamagePopups, setPlayerDamagePopups] = useState([]);

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
            
            await delay(PLAYER_TURN_DELAY);

            const results = game.slotMachine.spin(game.player.slotCount); 
            const multiplier = game.calculateMultiplier(results);

            setSlotResults(results);
            await delay(1000); 
            setIsSpinning(false); 
            await delay(500);

            for (let i = 0; i < results.length; i++) {
                setCurrentlyProcessingSlotIndex(i);
                syncGameState();
                
                const itemResult = results[i];
                const result = game.processSingleSlotResult(itemResult, multiplier);
                
                syncGameState();
                
                if(itemResult['type'] === 'Attack') {
                    let currentPopups = [];
                    
                    if (result.physicalDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.physicalDamage), 
                            type: 'physical' 
                        });
                    }
                    if (result.poisonDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.poisonDamage), 
                            type: 'poison' 
                        });
                    }
                    if (result.fireDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.fireDamage), 
                            type: 'fire' 
                        });
                    }
                    if (result.iceDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.iceDamage), 
                            type: 'ice' 
                        });
                    }
                    if (result.lightningDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.lightningDamage), 
                            type: 'lightning' 
                        });
                    }
                    if (result.holyDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.holyDamage), 
                            type: 'holy' 
                        });
                    }
                    if (result.darkDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.darkDamage), 
                            type: 'dark' 
                        });
                    }
                    if (result.magicDamage > 0) {
                        currentPopups.push({ 
                            id: Date.now() + Math.random(), 
                            value: Math.floor(result.magicDamage), 
                            type: 'magic' 
                        });
                    }
                    
                    for (let popup of currentPopups) {
                        setMonsterDamagePopups([popup]);
                        await delay(800);
                        setMonsterDamagePopups([]);
                        await delay(200);
                    }
                }

                if (game.currentMonster && game.currentMonster.hp <= 0) {
                    game.handleMonsterDefeat(); 
                    syncGameState();
                    setCurrentlyProcessingSlotIndex(-1);
                    setIsSpinning(false);
                    return;
                }

                await delay(ACTION_DELAY); 
            }
            
            setCurrentlyProcessingSlotIndex(-1);
            
            if (game.gameState === 'Combat') {
                await delay(MONSTER_TURN_DELAY); 
                const { damageTaken, status: monsterStatus, poisonDamage } = game.monsterAttack(); 
                syncGameState();

                if (poisonDamage > 0) {
                    setMonsterDamagePopups([{ id: Date.now(), value: poisonDamage, type: 'poison' }]);
                    await delay(800);
                    setMonsterDamagePopups([]);
                    await delay(200);
                }

                if (monsterStatus === 'win') {
                    setIsSpinning(false);
                    return; 
                }
                
                if (damageTaken > 0) {
                    const playerPopup = {
                        id: Date.now(),
                        value: damageTaken,
                        type: 'physical',
                    };
                    setPlayerDamagePopups([playerPopup]);
                    await delay(1200);
                    setPlayerDamagePopups([]);
                }
                
                syncGameState();
                
                if (monsterStatus === 'lose') {
                    setGameState('GameOver');
                    setIsSpinning(false);
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
            alert("이미 최대 슬롯 개수입니다.!");
        } else {
            alert("골드가 부족합니다!");
        }
    };

    const getShopItems = () => {
        return game.allEquipment.filter(item => item.cost > 0); 
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

    React.useEffect(() => {
        console.log('Player Damage Popups:', playerDamagePopups);
        console.log('Monster Damage Popups:', monsterDamagePopups);
    }, [playerDamagePopups, monsterDamagePopups]);

    return {
        game,
        gameState,
        playerState,
        monsterState,
        stage,
        slotResults,
        isSpinning,
        damageTaken,
        startPlayerTurn,
        goToNextStage,
        restartGame,
        setInitialWeapons,
        upgradeMaxHp,
        upgradeSlotCount,
        getShopItems,
        handleBuyWeapon,
        damagePopups,
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups,
    };
};
