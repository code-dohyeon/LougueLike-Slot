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
import './styles/style.css';

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
        handleRefreshShop
    } = useGame();

    const [showStartScreen, setShowStartScreen] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
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
    }, [gameState, isGameOver]);

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
                            isBlocked={isBlocked}
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
                    handleRefreshShop={handleRefreshShop}
                    shopInventory={getShopInventory()}
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
                        data-testid="button-restart"
                    >
                        🔄 다시 도전하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
