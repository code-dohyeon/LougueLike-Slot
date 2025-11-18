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
        // 💡 수정: game.currentMonster가 null일 경우 안전하게 null로 초기화
        setMonsterState(game.currentMonster ? { ...game.currentMonster } : null); 
        setStage(game.stage);
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

const startPlayerTurn = useCallback(async (slotCount) => {
    if (isSpinning || gameState !== 'Combat') return;

    console.log('🎰 === 턴 시작 ===');

    // ============================================
    // 1단계: 슬롯 회전 시작
    // ============================================
    setSlotResults(null); // 이전 결과 완전히 초기화
    setIsSpinning(true); // 슬롯 회전 시작
    
    console.log('🔄 슬롯 회전 중...');
    
    // 💡 [수정] game.startTurn 호출:
    // 1. 슬롯 결과 계산 (results)
    // 2. 🚨 player/monster의 HP/DF/Gold를 직접 수정 (side effect)
    // 3. 피해 요약 정보(damage)를 반환
    const { results, damage } = game.startTurn(slotCount); 
    console.log('🎲 계산된 슬롯 결과:', results);
    
    // 슬롯 회전 애니메이션 시간 (1.5초)
    await delay(1500); 
    
    // ============================================
    // 2단계: 슬롯 완전히 멈춤 + 결과 표시
    // ============================================
    setIsSpinning(false); // 슬롯 회전 멈춤
    setSlotResults(results); // 결과 표시
    
    console.log('⏹️ 슬롯 멈춤! 결과:', results);
    
    // 💡 사용자가 슬롯 결과를 확인할 시간 (2초)
    await delay(2000); 

    // ============================================
    // 3단계: 플레이어 행동 적용 (이미 game.startTurn에서 적용됨)
    // ============================================
    console.log('⚔️ 플레이어 행동 적용 시작 (HP/DF/Gold 변경됨)');
    
    // 🚨 [삭제!] const turnResult = game.applyPlayerActions(results, effects); 
    syncGameState(); // HP, DF, Gold 변경사항 UI 반영

    // 💡 [수정] damageSummary를 사용해 콘솔 로그 및 팝업 처리
    console.log('💫 적용된 효과 - 물리 데미지:', damage.physical, '독 적용 신호:', damage.poison);

    // 데미지/독 팝업 표시
    const popups = [];
    if(damage.totalPhysicalDamage > 0) {
        popups.push({ 
            id: Date.now() + 1, 
            value: Math.floor(damage.totalPhysicalDamage), // item.js에서 반환된 물리 피해 사용
            type: 'physical' 
        });
        
        const monsterElement = document.getElementById('game-status');
        if (monsterElement) {
            monsterElement.classList.add('monster-hit');
            setTimeout(() => monsterElement.classList.remove('monster-hit'), 400);
        }
    }
    
    if(damage.totalPoisonDamage > 0) { 
        popups.push({ 
            id: Date.now() + 2, 
            value: 0, 
            type: 'poisonApply' 
        }); 
    }

    if(popups.length > 0) {
        setDamagePopups(popups);
        await delay(1200); 
        setDamagePopups([]);
    }

    // 💡 [수정] 승리 체크: game.startTurn() 실행 후 몬스터 HP가 0 이하인지 직접 체크
    if (game.currentMonster && game.currentMonster.hp <= 0) {
        // 승리 로직은 gameManager.js에서 처리되므로, 여기서는 UI 업데이트 후 종료
        console.log('🎉 몬스터 처치! 승리!');
        return; 
    }

    // ============================================
    // 4단계/5단계: 몬스터 턴 (독 피해 처리 및 일반 공격 통합)
    // ============================================
    console.log('👹 몬스터 턴 시작! (독 피해 + 일반 공격)');
    await delay(500); 
    
    // 💡 [통합] monsterAttack() 한 번 호출로 독 피해, 일반 공격, 승패 체크 모두 처리
    const { damageTaken, status: monsterStatus, poisonDamage } = game.monsterAttack(); 
    
    syncGameState(); // 모든 상태 변경 반영 (HP, DF, 몬스터 상태)
    
    // 💡 독 피해 팝업 처리
    if (poisonDamage > 0) { 
        console.log('💀 독 피해:', poisonDamage);
        setDamagePopups([{ 
            id: Date.now() + 3, 
            value: poisonDamage, 
            type: 'poison' 
        }]);
        await delay(1200); 
        setDamagePopups([]); 
    }

    // 💡 승리 체크 (독 피해로 인한 승리도 여기서 잡힘)
    if (monsterStatus === 'win') {
        console.log('🎉 몬스터 처치! 승리!');
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
    
    syncGameState(); // 몬스터 공격 결과 (플레이어 HP/DF) 최종 반영 (두 번 해도 무방)
    
    // 💡 패배 체크
    if (monsterStatus === 'lose') {
        console.log('💀 플레이어 사망... 패배');
        setGameState('GameOver');
        return;
    }
    
    // ============================================
    // 6단계: 턴 종료
    // ============================================
    console.log('✅ === 턴 종료 ===\n');
    
    const shieldElement = document.getElementById('player-df');
    const goldElement = document.getElementById('player-gold');
    
    if (shieldElement && damage.totalDefense > 0) {
        shieldElement.classList.add('shield-gain');
        setTimeout(() => shieldElement.classList.remove('shield-gain'), 600);
    }
    
    if (goldElement && damage.totalResource > 0) {
        goldElement.classList.add('gold-gain');
        setTimeout(() => goldElement.classList.remove('gold-gain'), 600);
    }

}, [gameState, isSpinning, game, syncGameState])

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

        try {
            // 1. 슬롯 돌리기 및 결과/배율 계산 (GameManager의 startPlayerTurn 사용)
            const turnData = game.startPlayerTurn(); 
            const results = turnData.results;
            const multiplier = turnData.multiplier;
            
            // 2. 슬롯 결과 표시 (애니메이션이 재생된다고 가정)
            setSlotResults(results);
            await delay(PLAYER_TURN_DELAY); // 슬롯 애니메이션 종료 대기

            // 3. 🚨🚨🚨 각 슬롯 결과를 순차적으로 처리하는 루프 🚨🚨🚨
            for (let i = 0; i < results.length; i++) {

                // 💡 [이펙트 시작] 현재 처리 중인 릴 인덱스 업데이트
                setCurrentlyProcessingSlotIndex(i);

                // 3-1. 단일 슬롯 결과 처리 (상태 변경)
                const result = game.processSingleSlotResult(results[i], multiplier);
                
                // 3-2. React 상태 동기화 및 UI 업데이트
                syncGameState(); 

                // 3-3. 데미지 팝업 등의 시각 효과를 위한 상태 업데이트
                if (result.physicalDamage > 0) {
                    const newPopup = { id: Date.now() + i, damage: result.physicalDamage, type: 'monster' };
                    setDamagePopups([newPopup]); // 🚨 배열 전체를 덮어쓰거나, 팝업 처리를 단일화해야 함
                    
                    // 💡 팝업을 표시할 시간을 따로 주고, 루프 딜레이 전에 팝업을 지워야 함
                    await delay(300); // 팝업이 잠시 보일 시간
                    setDamagePopups([]); // 팝업 초기화 (DamagePopup 컴포넌트 내부 로직과 상충될 수 있으니 주의)
                }
                
                // 3-4. 몬스터 사망 체크 (중요: 순차 처리 중에도 죽을 수 있음)
                if (result.isDead) {
                    game.handleMonsterDefeat(); 
                    syncGameState();
                    await delay(ACTION_DELAY * 2); // 죽는 이펙트를 위해 잠시 대기
                    break; // 루프 종료
                }

                await delay(ACTION_DELAY); // 릴 행동 사이 딜레이
            }
            
            setCurrentlyProcessingSlotIndex(-1);

            // 4. 몬스터 턴 시작
            if (game.gameState === 'Combat') { // 몬스터가 살아있을 때만
                await delay(MONSTER_TURN_DELAY); // 몬스터 턴 시작 전 대기
                await game.monsterTurn(); // 몬스터 턴 진행 (이것도 내부적으로 비동기 처리 권장)
                syncGameState(); 
            }

        } catch (error) {
            console.error("Error during spin:", error);
        } finally {
            setIsSpinning(false);
            // setSlotResults(null); // 다음 턴을 위해 초기화
        }
    }, [gameState, isSpinning, game, syncGameState]);


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
        currentlyProcessingSlotIndex,
    };
};
