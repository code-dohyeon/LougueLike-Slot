import { useState, useMemo, useCallback } from 'react';
import GameManager from '../logic/gameManager'; 
import React from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SPIN_DURATION = 800; // 스핀 애니메이션 시간
const RESULT_SHOW_DELAY = 300; // 결과 표시 후 대기
const ACTION_DELAY = 200; // 각 슬롯 처리 간 딜레이 (데미지 팝업용)
const MONSTER_TURN_DELAY = 800; // 몬스터 턴 전 대기

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
            
            // 1. 스핀 결과 미리 계산
            const results = game.slotMachine.spin(game.player.slotCount);
            const multiplier = game.calculateMultiplier(results);

            // 2. 스핀 애니메이션 시작 (결과는 아직 안 보여줌)
            await delay(SPIN_DURATION);

            // 3. 스핀 멈추고 결과 표시
            setSlotResults(results);
            setIsSpinning(false);
            await delay(RESULT_SHOW_DELAY);

            // 4. 각 슬롯 결과 처리 (데미지 팝업 동시 표시, 딜레이 최소화)
            for (let i = 0; i < results.length; i++) {
                setCurrentlyProcessingSlotIndex(i);
                
                const itemResult = results[i];
                const result = game.processSingleSlotResult(itemResult, multiplier);
                
                syncGameState();
                
                // 공격 타입일 때만 데미지 팝업 표시
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
                    
                    // 모든 데미지 팝업 동시에 표시
                    if (popups.length > 0) {
                        setMonsterDamagePopups(popups);
                    }
                }

                // 몬스터 처치 확인
                if (game.currentMonster && game.currentMonster.hp <= 0) {
                    game.handleMonsterDefeat();
                    syncGameState();
                    setCurrentlyProcessingSlotIndex(-1);
                    setMonsterDamagePopups([]);
                    return;
                }

                // 짧은 딜레이 (팝업이 보이도록)
                await delay(ACTION_DELAY);
                setMonsterDamagePopups([]); // 팝업 클리어
            }
            
            setCurrentlyProcessingSlotIndex(-1);
            
            // 5. 몬스터 턴
            if (game.gameState === 'Combat') {
                await delay(MONSTER_TURN_DELAY);
                
                const { damageTaken, status: monsterStatus, poisonDamage } = game.monsterAttack();
                syncGameState();

                // 독 데미지 팝업
                if (poisonDamage > 0) {
                    setMonsterDamagePopups([{ id: Date.now(), value: poisonDamage, type: 'poison' }]);
                    await delay(600);
                    setMonsterDamagePopups([]);
                }

                // 승리 체크
                if (monsterStatus === 'win') {
                    return;
                }
                
                // 플레이어 피해 팝업
                if (damageTaken > 0) {
                    const playerPopup = { id: Date.now(), value: damageTaken, type: 'physical' };
                    setPlayerDamagePopups([playerPopup]);
                    await delay(800);
                    setPlayerDamagePopups([]);
                }
                
                syncGameState();
                
                // 패배 체크
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
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups,
    };
};