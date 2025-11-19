import React, { useEffect } from 'react';
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
import '../src/styles/style.css';

function App() {
    const {
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
        handleUpgradeWeapon
    } = useGame();

    const [showStartScreen, setShowStartScreen] = React.useState(true);
    const [isGameOver, setIsGameOver] = React.useState(false);

    useEffect(() => {
        if (gameState === 'GameOver' && !isGameOver) {
            setIsGameOver(true);
            
            // 상태바 떨어지는 애니메이션
            const statusElements = document.querySelectorAll('.game-status, .player-status, .game-info');
            statusElements.forEach((el, idx) => {
                setTimeout(() => {
                    el.classList.add('status-fall-animation');
                }, idx * 100);
            });
            
            // 게임 오버 화면 떨어지는 애니메이션
            setTimeout(() => {
                const gameOverContainer = document.querySelector('.game-over-container');
                if (gameOverContainer) {
                    gameOverContainer.classList.add('game-over-drop-animation');
                }
            }, 800);
        }
    }, [gameState, isGameOver]);

    const handleGameStart = () => {
        setShowStartScreen(false);
    };

    if (showStartScreen) {
        return <GameStart onStart={handleGameStart} />;
    }

    return (
        <div className="game-wrapper">
            {/* 햄버거 메뉴 (전투 중에만 표시) */}
            {gameState === 'Combat' && (
                <div 
                    className={`hamburger-menu ${showInventory ? 'open' : ''}`}
                    onClick={toggleInventory}
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </div>
            )}

            {/* 인벤토리 */}
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

            {gameState === 'Combat' && (
                <>
                    <div style={{ position: 'relative' }}>
                        <MonsterStatus 
                            monster={monsterState} 
                            damagePopups={monsterDamagePopups}
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
                        />

                        <SpinButton 
                            onClick={startPlayerTurn}
                            isSpinning={isSpinning}
                        />
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
                />
            )}

            {gameState === 'GameOver' && (
                <div className="game-over-container" style={{ opacity: 0 }}>
                    <div className="game-over-text">💀 GAME OVER 💀</div>
                    <p style={{ color: '#fca5a5', fontSize: '1.25rem', marginBottom: '2rem' }}>
                        Stage {stage}에서 전사했습니다...
                    </p>
                    <button 
                        className="btn btn-restart"
                        onClick={restartGame}
                    >
                        🔄 다시 도전하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;