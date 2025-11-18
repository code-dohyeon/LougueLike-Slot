// src/hooks/useGame.js

import { useState, useMemo } from 'react';
// 💡 로직 파일 경로 수정: ./logic 폴더에서 가져옴
import GameManager from '../logic/gameManager'; 
import { useCallback } from 'react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 턴 딜레이 상수 (index.js에서 가져옴)
const PLAYER_TURN_DELAY = 1000;
const MONSTER_TURN_DELAY = 1000; 

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
    
    // 💡 GameManager의 상태를 React 상태로 동기화하는 핵심 함수
    const syncGameState = () => {
        setGameState(game.gameState);
        setPlayerState({ ...game.player });
        // 💡 수정: game.currentMonster가 null일 경우 안전하게 null로 초기화
        setMonsterState(game.currentMonster ? { ...game.currentMonster } : null); 
        setStage(game.stage);
    };

    // ----------------------------------------------------
    // 턴 로직 (바닐라 JS의 턴 로직을 가져와 Promise/setTimeout으로 변환)
    // ----------------------------------------------------

    // 몬스터 턴 처리
    const processMonsterTurn = () => {
        setIsSpinning(true); // 몬스터 턴이 끝날 때까지 스핀 버튼 비활성화 유지
        
        setTimeout(() => {
            // GameManager에서 몬스터 공격 로직 실행
            const { status, damageTaken: actualDamage } = game.processMonsterTurn();
            
            setDamageTaken(actualDamage); // 데미지 상태 업데이트 (UI 애니메이션용)
            syncGameState(); // 몬스터 공격 결과 반영 (HP 감소 등)

            if (status === 'lose') {
                // 게임 오버 처리
                setGameState('GameOver');
            } else {
                // 전투 계속: 다음 턴 준비 완료
                setIsSpinning(false);
            }
        }, MONSTER_TURN_DELAY); 
    };

    // 플레이어 턴 처리
    // 💡 startPlayerTurn 함수 (async/await 적용)
    const startPlayerTurn = useCallback(async () => {
        // 1. 초기 체크
        if (gameState !== 'Combat' || isSpinning) return;
        if (!game.currentMonster) return; // 몬스터가 없으면 실행 중단 (안전장치)
        
        // 2. 슬롯 돌리기 시작
        setIsSpinning(true);
        setSlotResults(null); 
        await delay(PLAYER_TURN_DELAY); // 💡 딜레이 대기

        // 3. 슬롯 돌리기 멈춤 및 결과 처리 (플레이어 공격)
        const { status, results, damage } = game.startTurn(); // 몬스터 공격 로직 제거됨!
        
        setSlotResults(results);
        setPlayerState({ ...game.player });
        setMonsterState({ ...game.currentMonster }); // 몬스터 HP/방어력 업데이트
        
        setIsSpinning(false); // 슬롯 멈춤

        const popups = [];
        if(damage.physical > 0) {
            popups.push({ id: Date.now() + 1, value: Math.floor(damage.physical), type: 'physical' });
        }
        if(damage.poison > 0) {
            popups.push({ id: Date.now() + 2, value: damage.poison, type: 'poison' });
        }
        if(popups.length > 0) {
            setDamagePopups(popups);
            await delay(1000);
            setDamagePopups([]);
        }

        // 4. 승리 체크
        if (status === 'win') {
        setGameState('WinPhase'); // 임시 상태를 넣어서 UI에 승리 메시지를 표시할 수 있게 함
        syncGameState();
        await delay(1500); // 1.5초간 승리 메시지 대기 시간 (몬스터 사라짐 애니메이션 시간)
        
        setGameState('ShopPhase'); // 상점 상태로 전환
        syncGameState();
        return;
        } 

        await delay(500); // 슬롯 결과 확인 시간'        

        let poisonDamageOnMonsterTurn = 0;
        if(game.currentMonster && game.currentMonster.processStatusEffects) {
            poisonDamageOnMonsterTurn = game.currentMonster.processStatusEffects();

            if(game.aliveChecked(game.currentMonster)) {
                game.player.gold += 100 + game.stage * 10;
                game.stage++;

                setMonsterState({...game.currentMonster});

                if(poisonDamageOnMonsterTurn > 0) {
                    setDamagePopups([{id: Date.now() + 3, value: poisonDamageOnMonsterTurn, type: 'poison'}]);
                    await delay(1000);
                    setDamagePopups([])
                }

                setGameState('WinPhase');
                syncGameState();
                await delay(1500);

                setGameState('ShopPhase');
                syncGameState();
                return;
            }
            setMonsterState({...game.currentMonster});
        }

        if(poisonDamageOnMonsterTurn > 0) {
            setDamagePopups([{id: Date.now() + 3, value: poisonDamageOnMonsterTurn, type: 'poison'}]);
            await delay(1000);
            setDamagePopups([])
        }

        const { damageTaken, status: monsterStatus } = game.monsterAttack();

        setDamageTaken(damageTaken);        
    }, [gameState, isSpinning, game, syncGameState]); // 💡 syncGameState를 useCallback 의존성에 추가
    
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
        processMonsterTurn,
        damagePopups,
    };
};