import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import GameStart from './components/GameStart';
import InitialSetup from './components/InitialSetup';
import MonsterStatus from './components/MonsterStatus';
import PlayerStatus from './components/PlayerStatus';
import SlotMachine from './components/SlotMachine';
import SpinButton from './components/SpinButton';
import Shop from './components/Shop';
import DamagePopups from './components/DamagePopups';
import ResourcePopups from './components/ResourcePopups';
import Inventory from './components/Inventory';
import { monsters, bosses } from './logic/data';
import './styles/style.css';
import ComboEffect from './components/ComboEffect';
import ElectricEffectPopup from './components/ElectricEffectPopup';
import Player from './logic/player';

function App() {
    const {
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
        handleBuyWeapon,
        handleSellWeapon,
        handleUpgradeWeapon,
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups,
        resourcePopups,
        showInventory,
        toggleInventory,
        getShopInventory,
        handleRefreshShop,
        comboTriggered,
        setComboTriggered,
        electricEffectTriggered,
        setElectricEffectTriggered,
        comboActiveSlotIndexes,
        fireElementDamage,
    } = useGame();

    const [showStartScreen, setShowStartScreen] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (comboTriggered) {
            const timer = setTimeout(() => {
                setComboTriggered(false); // 1.5초 후 콤보 상태 초기화
            }, 1500); // CSS 애니메이션 시간과 일치
            return () => clearTimeout(timer);
        }

        // 💡 [새로 추가] 전기 속성 팝업 타이머 관리 (1초 후 사라지게)
        if (electricEffectTriggered) {
            const timer = setTimeout(() => {
                setElectricEffectTriggered(false);
            }, 1000); 
            return () => clearTimeout(timer);
        }

        if (gameState === 'GameOver' && !isGameOver) {
            setIsGameOver(true);
            
            const statusElements = document.querySelectorAll('.game-status, .player-status, .game-info, .combat-element');
            statusElements.forEach((el, idx) => {
                setTimeout(() => {
                    el.classList.add('status-fall-animation');
                }, idx * 100);
            });
            
            setTimeout(() => {
                const gameOverContainer = document.querySelector('.game-over-container');
                if (gameOverContainer) {
                    gameOverContainer.classList.add('game-over-drop-animation');
                }
            }, 800);
        }
    }, [gameState, isGameOver, comboTriggered, setComboTriggered]);

    // 💥💥 뷰포트 높이 설정 로직 (App 컴포넌트 함수 내부) 💥💥
    useEffect(() => {
        // 뷰포트 높이를 계산하고 CSS 변수로 설정하는 함수
        const setAppHeight = () => {
            // 뷰포트의 실제 높이(px)를 계산한다. (모바일 UI 제외)
            const vh = window.innerHeight * 0.01;
            // 계산된 값을 CSS 변수 --app-height로 설정한다.
            document.documentElement.style.setProperty('--app-height', `${vh * 100}px`);
        };

        // 💥 컴포넌트 마운트 시 최초 설정
        setAppHeight();
        
        // 💥 뷰포트 크기 변경(폰 방향 전환 등) 시 재계산
        window.addEventListener('resize', setAppHeight);
        
        // 💥 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업)
        return () => {
            window.removeEventListener('resize', setAppHeight);
        };
    }, []); // 빈 배열: 앱이 마운트될 때 딱 한 번만 실행!

    const handleGameStart = () => {
        setShowStartScreen(false);
    };

    if (showStartScreen) {
        return <GameStart onStart={handleGameStart} />;
    }

    return (
        <div className="game-wrapper">
            {gameState === 'Combat' && (
                <div 
                    className={`hamburger-menu ${showInventory ? 'open' : ''}`}
                    onClick={toggleInventory}
                    data-testid="button-hamburger-menu"
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </div>
            )}

            <Inventory 
                player={playerState}
                shopItems={getShopItems()}
                isOpen={showInventory}
                onClose={toggleInventory}
            />

            {gameState === 'InitialSetup' && (
                <InitialSetup 
                    allEquipment={getShopItems()} 
                    setWeapons={setInitialWeapons}
                />
            )}

            {comboTriggered && <ComboEffect active={comboTriggered} />}
            <ElectricEffectPopup active={electricEffectTriggered} position={{ x: 50, y: 35 }} /> {/* 💡 [추가] 렌더링 확인 */}

            {gameState === 'Combat' && (
                <>
                    <div className="combat-container">
                        <div style={{ position: 'relative' }}>
                            <MonsterStatus 
                                monster={monsterState} 
                                monsterImage={[...monsters, ...bosses]}
                                damagePopups={monsterDamagePopups}
                                fireElementDamage={fireElementDamage}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <PlayerStatus player={playerState} stage={stage} />
                            <DamagePopups popups={playerDamagePopups} popupType="player" />
                            <ResourcePopups popups={resourcePopups} />
                        </div>
                    
                        <div className="combat-phase">
                            <SlotMachine 
                                slotCount={playerState.slotCount}
                                slotResults={slotResults}
                                isSpinning={isSpinning}
                                currentlyProcessingSlotIndex={currentlyProcessingSlotIndex}
                                currentEquipment={playerState.equippedWeapons}
                                // 💡 [핵심 수정] 콤보 활성 인덱스 prop 전달
                                comboActiveSlotIndexes={comboActiveSlotIndexes}
                            />

                            <SpinButton 
                                onClick={startPlayerTurn}
                                isSpinning={isSpinning}
                                isBlocked={isBlocked}
                            />
                        </div>
                    </div>
                </>
            )}

            {gameState === 'ShopPhase' && (
                <Shop 
                    player={playerState}
                    stage={stage}
                    onUpgradeHp={upgradeMaxHp}
                    onUpgradeSlot={upgradeSlotCount}
                    onNextStage={goToNextStage}
                    shopItems={getShopItems()}
                    handleBuyWeapon={handleBuyWeapon}
                    handleSellWeapon={handleSellWeapon}
                    handleUpgradeWeapon={handleUpgradeWeapon}
                    game={game}
                    handleRefreshShop={handleRefreshShop}
                    shopInventory={getShopInventory()}
                />
            )}

            {gameState === 'GameOver' && (
                <div className="game-over-container" style={{ opacity: 0 }}>
                    <div className="game-over-text">💀 GAME OVER 💀</div>
                    <p>
                        Stage {stage}에서 전사했습니다...
                    </p>
                    <button 
                        className="btn btn-restart"
                        onClick={restartGame}
                        data-testid="button-restart"
                    >
                        🔄 다시 도전하기
                    </button>
                </div>
            )}

            {gameState === 'Ending' && (
                <Ending 
                    stage={stage}
                    playerState={playerState}
                    onRestart={restartGame}
                />
            )}

        </div>
    );
}

export default App;
