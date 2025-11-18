// src/hooks/useGame.js

import { useState, useMemo } from 'react';
import GameManager from '../logic/gameManager'; 
import { useCallback } from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 턴 딜레이 상수 (index.js에서 가져옴)
const PLAYER_TURN_DELAY = 1000;
const MONSTER_TURN_DELAY = 1000; 
const ACTION_DELAY = 500;

export const useGame = () => {
    // 💡 GameManager 인스턴스는 단 한 번만 생성
    const game = useMemo(() => new GameManager(), []);
    
    const [damagePopups, setDamagePopups] = useState([]);
    
    // 💡 React가 추적하고 UI에 반영할 핵심 상태들 정의
    const [gameState, setGameState] = useState(game.gameState);
    const [playerState, setPlayerState] = useState({ ...game.player });
    const [monsterState, setMonsterState] = useState(game.currentMonster ? { ...game.currentMonster } : null);
    const [stage, setStage] = useState(game.stage);
    const [slotResults, setSlotResults] = useState(null); // 슬롯 결과 애니메이션용
    const [isSpinning, setIsSpinning] = useState(false); // 버튼 비활성화용
    const [damageTaken, setDamageTaken] = useState(0); // 몬스터 공격 데미지 표시용 (애니메이션)
    
    // 💡 [새 상태] 현재 액션을 처리 중인 슬롯의 인덱스 (-1은 처리 중 아님)
    const [currentlyProcessingSlotIndex, setCurrentlyProcessingSlotIndex] = useState(-1);

    // 💡 GameManager의 상태를 React 상태로 동기화하는 핵심 함수
    const syncGameState = () => {
        setGameState(game.gameState);
        setPlayerState({ ...game.player });
        setMonsterState(game.currentMonster ? { ...game.currentMonster } : null);
        setStage(game.stage);

        // 상태 동기화 후 디버깅 로그 추가
        console.log('🔄 Game State Synced:', {
            gameState: game.gameState,
            playerState: { ...game.player },
            monsterState: game.currentMonster ? { ...game.currentMonster } : null,
            stage: game.stage,
        });
    };

    const handleMonsterTurn = useCallback(async () => {
        // 💡 몬스터 독 피해 처리
        const poisonResult = game.processMonsterPoisonDamage();
        syncGameState(); // 몬스터의 HP가 독 피해로 인해 변경된 것을 바로 반영!

        if (poisonResult.status === 'win') {
            // ... (승리 처리 로직)
            return;
        }
        
        // 💡 몬스터 공격
        // ... (기존 몬스터 공격 로직)
        
        // 몬스터 공격 후 다시 상태 동기화
        syncGameState();
        
        // ... (패배 처리 로직)
    
}, [syncGameState]); // `useGame.js` snippet에는 handleMonsterTurn이 없지만, 로직 흐름상 이렇게 되어야 함

const startPlayerTurn = useCallback(async () => {
    if (isSpinning || gameState !== 'Combat') return;
    setIsSpinning(true);
    console.log('🎰 === 턴 시작 ===');

    try {
        setSlotResults(null);
        setCurrentlyProcessingSlotIndex(-1);
        
        await delay(PLAYER_TURN_DELAY); // 1. (슬롯 돌리기 시작: isSpinning=true)

        // 1. 슬롯 돌리기 및 결과/배율 계산
        const results = game.slotMachine.spin(game.player.slotCount); 
        const multiplier = game.calculateMultiplier(results);
        
        console.log('🎲 계산된 슬롯 결과:', results);

        // 2. 슬롯 결과 확정
        setSlotResults(results); // 슬롯에 최종 결과를 전달 (SlotReel은 아직 isSpinning=true라 계속 돔)
        
        // 💡 [핵심 수정 1] 슬롯이 결과로 멈추는 것을 보여주기 위한 대기 시간 (예: 1초)
        await delay(1000); 
        
        // 💡 [핵심 수정 2] isSpinning을 false로 바꿔서 슬롯이 최종 결과를 표시하며 멈추게 함
        setIsSpinning(false); 
        
        await delay(500); // 슬롯이 완전히 멈춘 것을 사용자에게 보여주는 시간

        console.log('🔄 슬롯 멈춤. 이제 각 릴의 효과를 순차적으로 적용합니다.');


        // 3. 각 릴 결과 처리 (애니메이션과 함께) - 이제 isSpinning=false 상태에서 시작
        let popups = []; // 팝업 정보 누적을 위한 배열 선언
        
        for (let i = 0; i < results.length; i++) {
            
            // 3-0. 현재 처리 중인 슬롯 인덱스 설정 (UI 하이라이트)
            setCurrentlyProcessingSlotIndex(i);
            syncGameState(); // 하이라이트 즉시 적용을 위해 상태 동기화
            
            // 릴의 효과를 적용 
            const itemResult = results[i];
            const result = game.processSingleSlotResult(itemResult, multiplier);
            
            // 3-2. React 상태 동기화 및 UI 업데이트 (체력/쉴드/골드 변화)
            syncGameState(); 
            
            // 3-3. 데미지/효과 팝업 정보 누적
            if (result.physicalDamage > 0) {
                popups.push({ 
                    id: Date.now() + i + 10, 
                    value: Math.floor(result.physicalDamage), 
                    type: 'physical' 
                });
            }
            if (result.poisonApplied) {
                popups.push({ 
                    id: Date.now() + i + 20, 
                    value: 0, 
                    type: 'poisonApply' 
                });
            }

            // 3-4. 몬스터 사망 체크 (중요: 순차 처리 중에도 죽을 수 있음)
            if (game.currentMonster && game.currentMonster.hp <= 0) {
                console.log('🎉 몬스터 처치! 승리! (슬롯 효과 중)');
                game.handleMonsterDefeat(); 
                syncGameState();
                setCurrentlyProcessingSlotIndex(-1);
                break; // 루프 종료 후 4번 팝업 처리로 이동
            }

            // 릴 행동 사이 딜레이
            await delay(ACTION_DELAY); 
        }
        
        setCurrentlyProcessingSlotIndex(-1); // 하이라이트 해제

        // 4. 누적된 플레이어 턴 팝업 일괄 표시
        if (popups.length > 0) {
            setDamagePopups(popups);
            await delay(1200); 
            setDamagePopups([]);
        }
        
        // 5. 몬스터 턴 시작
        if (game.gameState === 'Combat') { // 몬스터가 살아있을 때만
            console.log('👹 몬스터 턴 시작! (독 피해 + 일반 공격)');
            await delay(MONSTER_TURN_DELAY); 
            
            // 💡 몬스터 공격 (독 피해, 일반 공격, 승패 체크 통합)
            const { damageTaken, status: monsterStatus, poisonDamage } = game.monsterAttack(); 
            syncGameState(); // 모든 상태 변경 반영
            
            // 💡 몬스터 턴 독 피해 팝업 처리
            if (poisonDamage > 0) { 
                console.log('💀 독 피해:', poisonDamage);
                setDamagePopups([{ 
                    id: Date.now() + 100, 
                    value: poisonDamage, 
                    type: 'poison' 
                }]);
                await delay(1200); 
                setDamagePopups([]); 
            }
            
            // 💡 독 피해로 인한 승리 체크
            if (monsterStatus === 'win') {
                console.log('🎉 몬스터 처치! 승리! (독 피해)');
                // gameManager.js에서 gameState가 이미 ShopPhase로 설정됨
                return; 
            }
            
            console.log('🩸 플레이어가 받은 피해:', damageTaken);
            
            // 💡 몬스터 일반 공격 피해 팝업 처리
            if (damageTaken > 0) {
                setDamageTaken(damageTaken);
                await delay(1200);
                setDamageTaken(0);
            }
            
            syncGameState(); // 몬스터 공격 결과 최종 반영
            
            // 💡 패배 체크
            if (monsterStatus === 'lose') {
                console.log('💀 플레이어 사망... 패배');
                setGameState('GameOver');
                return;
            }
        }
        console.log('✅ === 턴 종료 ===\n');

    } catch (error) {
        console.error("Error during spin:", error);
    } finally {
        // 에러가 발생했을 경우에만 버튼을 다시 활성화 (정상 작동 시에는 isSpinning을 위에서 false로 설정했기 때문에 필요 없음)
        if (isSpinning) {
            setIsSpinning(false);
        }
    }
}, [gameState, isSpinning, game, syncGameState, setCurrentlyProcessingSlotIndex, setDamagePopups, setGameState, setDamageTaken]);

    // ----------------------------------------------------
    // UI 버튼 액션 (바닐라 JS의 이벤트 리스너 대체)
    // ----------------------------------------------------

    const goToNextStage = () => {
        game.gameState = 'Combat'; 
        game.prepareNextCombat();
        setSlotResults(null); // 이전 슬롯 결과를 지움
        syncGameState();
    };

    const restartGame = () => {
        // 게임을 재시작하는 로직 (Player 초기화, Stage 1로 설정 등)
        // 이 부분은 GameManager에 restart() 메소드를 만들어두는 게 좋음
        window.location.reload(); // 일단은 간단하게 페이지 새로고침으로 처리
    };
    
    const setInitialWeapons = (itemIds) => {
        game.setInitialWeapons(itemIds);
        syncGameState();
    }
    
    // 💡 업그레이드 로직도 훅에 포함하여 UI 컴포넌트에서 호출할 수 있게 함
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

    // 💡 [새 함수] 상점에 표시할 아이템 목록을 가져오는 함수
    // 코스트가 0이 아닌 아이템만 상점에 표시하도록 필터링
    const getShopItems = () => {
        // allEquipment는 data.js의 equipment를 참조
        return game.allEquipment.filter(item => item.cost > 0); 
    };

    // 💡 [새 함수] 무기 구매
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

    const handleSpin = useCallback(async () => {
        if (isSpinning || gameState !== 'Combat') return;
        setIsSpinning(true);

        
    }, [gameState, isSpinning, game, syncGameState]);


    // 💡 무기 업그레이드 함수 연결
    const upgradeWeaponsClick = () => {
        console.log('🔧 Calling upgradeWeapons...');
        const result = game.upgradeWeapons(); // GameManager의 업그레이드 로직 호출
        alert(result.message);
        console.log('🔄 Upgrade result:', result);
        syncGameState(); // 상태 동기화
        return result;
    };

    return {
        game, // (참고용) 필요하다면 GameManager 인스턴스 자체를 반환
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
        isSpinning,
        damageTaken,
        startPlayerTurn,
        handleMonsterTurn,
        handleBuyWeapon,
        getShopItems,
        damagePopups,
        handleSpin,
        upgradeWeaponsClick,
        currentlyProcessingSlotIndex,
    };
};
