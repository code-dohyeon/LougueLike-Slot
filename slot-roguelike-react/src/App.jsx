// src/App.jsx

import React from 'react';
import { useGame } from './hooks/useGame';
import PlayerStatus from './components/PlayerStatus';
import MonsterStatus from './components/MonsterStatus';
import SlotMachine from './components/SlotMachine'; // 💡 통합
import SpinButton from './components/SpinButton';   // 💡 통합
import Shop from './components/Shop';
import InitialSetup from './components/InitialSetup';
import DamagePopup from './components/DamagePopup';
// import InitialSetup from './components/InitialSetup';
// import Shop from './components/Shop';


function App() {
    const { 
        gameState, 
        playerState, 
        monsterState, 
        stage, 
        restartGame, 
        startPlayerTurn, // 💡 슬롯 돌리기 함수
        slotResults,     // 💡 슬롯 결과
        isSpinning,      // 💡 슬롯 회전 상태
        setInitialWeapons, 
        game,
        goToNextStage,
        upgradeMaxHp,
        upgradeSlotCount,
        damageTaken,
    } = useGame();
    
    // 게임 오버 상태일 때 body 클래스 추가/제거 로직 (유지)
    React.useEffect(() => {
        if (gameState === 'GameOver') {
            document.body.classList.add('game-over');
        } else {
            document.body.classList.remove('game-over');
        }
    }, [gameState]);


    return (
        <div className="game-wrapper">
            {/* PlayerStatus 위쪽에 팝업을 표시할 컨테이너 추가 */}
            <div style={{ position: 'relative' }}> 
                <DamagePopup damage={damageTaken} />
                <PlayerStatus 
                    player={playerState} 
                    stage={stage} 
                    onRestart={restartGame} 
                />
            </div>

            {/* gameState에 따른 조건부 렌더링 */}
            
            {/* InitialSetup (무기 선택 화면) */}
            {gameState === 'InitialSetup' && (
                <InitialSetup 
                    allEquipment={game.allEquipment} // GameManager에서 모든 장비 데이터 전달
                    setWeapons={setInitialWeapons} // 선택한 무기 ID 배열을 전달할 함수
                />
            )}
            
            {/* 전투 화면: SlotMachine과 SpinButton 통합 */}
            {gameState === 'Combat' && (
                <>
                    <MonsterStatus monster={monsterState} />
                    
                    <div className="combat-phase">
                        <SlotMachine 
                            slotCount={playerState.slotCount}
                            slotResults={slotResults}
                            isSpinning={isSpinning}
                        />
                        
                        <SpinButton 
                            onClick={startPlayerTurn}
                            isSpinning={isSpinning}
                        />
                    </div>
                </>
            )}
            
            {/* 상점 화면: Shop 컴포넌트 통합 */}
            {gameState === 'ShopPhase' && (
                <Shop 
                    player={playerState}
                    stage={stage}
                    onUpgradeHp={upgradeMaxHp}
                    onUpgradeSlot={upgradeSlotCount}
                    onNextStage={goToNextStage}
                />
            )}
            
            {/* 게임 오버 화면 */}
            {gameState === 'GameOver' && (
                <div className="game-over-container">
                    <h1 className="game-over-text">GAME OVER</h1>
                    <button className="btn btn-danger" onClick={restartGame}>다시 도전</button>
                </div>
            )}
        </div>
    );
}

export default App;