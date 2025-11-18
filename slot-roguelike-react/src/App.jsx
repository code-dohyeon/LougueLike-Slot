'use client';

import React from 'react';
import { useGame } from './hooks/useGame';
import PlayerStatus from './components/PlayerStatus';
import MonsterStatus from './components/MonsterStatus';
import SlotMachine from './components/SlotMachine';
import SpinButton from './components/SpinButton';
import Shop from './components/Shop';
import InitialSetup from './components/InitialSetup';
import DamagePopup from './components/DamagePopup';
import GameStart from './components/GameStart';

function App() {
    const [showStartScreen, setShowStartScreen] = React.useState(true);
    
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
        damageTaken,
        getShopItems,
        handleBuyWeapon,
        handleUpgradeWeapons,
        currentlyProcessingSlotIndex
    } = useGame();
    
    React.useEffect(() => {
        if (gameState === 'GameOver') {
            document.body.classList.add('game-over');
        } else {
            document.body.classList.remove('game-over');
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
                    <div style={{ position: 'relative' }}> 
                        <DamagePopup damage={damageTaken} />
                        <PlayerStatus 
                            player={playerState} 
                            stage={stage} 
                            onRestart={restartGame} 
                        />
                    </div>

                    {gameState === 'InitialSetup' && (
                        <InitialSetup 
                            allEquipment={game.allEquipment}
                            setWeapons={setInitialWeapons}
                        />
                    )}
                    
                    {gameState === 'Combat' && (
                        <>
                            <MonsterStatus monster={monsterState} />
                            
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
                            handleUpgradeWeapons={handleUpgradeWeapons}
                        />
                    )}
                    
                    {gameState === 'GameOver' && (
                        <div className="game-over-container">
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
