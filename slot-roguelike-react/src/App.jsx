'use client';

import React from 'react';
import { useGame } from './hooks/useGame';
import PlayerStatus from './components/PlayerStatus';
import MonsterStatus from './components/MonsterStatus';
import SlotMachine from './components/SlotMachine';
import SpinButton from './components/SpinButton';
import Shop from './components/Shop';
import InitialSetup from './components/InitialSetup';
import DamagePopups from './components/DamagePopups';
import GameStart from './components/GameStart';

function App() {
    const [showStartScreen, setShowStartScreen] = React.useState(true);
    const [gameOverAnimation, setGameOverAnimation] = React.useState(false);
    
    const { 
        gameState, 
        playerState, 
        monsterState, 
        stage, 
        restartGame, 
        startPlayerTurn,
        slotResults,
        isSpinning,
        setInitialWeapons, 
        game,
        goToNextStage,
        upgradeMaxHp,
        upgradeSlotCount,
        getShopItems,
        handleBuyWeapon,
        currentlyProcessingSlotIndex,
        monsterDamagePopups,
        playerDamagePopups
    } = useGame();
    
    React.useEffect(() => {
        if (gameState === 'GameOver') {
            document.body.classList.add('game-over');
            setGameOverAnimation(true);
        } else {
            document.body.classList.remove('game-over');
            setGameOverAnimation(false);
        }
    }, [gameState]);

    const handleGameStart = () => {
        setShowStartScreen(false);
    };

    return (
        <div className="game-wrapper">
            {showStartScreen && (
                <GameStart onStart={handleGameStart} />
            )}
            
            {!showStartScreen && (
                <>
                    {gameState === 'InitialSetup' && (
                        <InitialSetup 
                            allEquipment={game.allEquipment}
                            setWeapons={setInitialWeapons}
                        />
                    )}
                    
                    {gameState === 'Combat' && (
                        <>
                            <div className={`monster-area ${gameOverAnimation ? 'game-over-fall' : ''}`} style={{ position: 'relative' }}>
                                <MonsterStatus monster={monsterState} />
                                <DamagePopups popups={monsterDamagePopups} popupType="monster" />
                            </div>
                            <div className={`player-area ${gameOverAnimation ? 'game-over-fall' : ''}`} style={{ position: 'relative' }}>
                                <PlayerStatus 
                                    player={playerState} 
                                    stage={stage} 
                                    onRestart={restartGame} 
                                />
                                <DamagePopups popups={playerDamagePopups} popupType="player" />
                            </div>
                            <div className={`combat-phase ${gameOverAnimation ? 'game-over-fall' : ''}`}>
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
                            game={game}
                        />
                    )}
                    
                    {gameState === 'GameOver' && (
                        <div className="game-over-container game-over-drop">
                            <h1 className="game-over-text">GAME OVER</h1>
                            <button className="btn btn-danger" onClick={restartGame}>다시 도전</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
