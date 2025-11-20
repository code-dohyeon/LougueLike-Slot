function Ending({ stage, playerState, onRestart }) {
    return (
        <div className="game-over-container">
            <h1 className="game-over-title">🎉 축하합니다! 🎉</h1>
            <div className="ending-content">
                <p className="game-over-text">모든 스테이지를 클리어했습니다!</p>
                <div className="ending-stats">
                    <p>✨ 최종 스테이지: {stage - 1}</p>
                    <p>💰 최종 골드: {Math.floor(playerState.gold)}</p>
                    <p>⚔️ 장착 무기: {playerState.equippedWeapons.length}개</p>
                    <p>📊 레벨: {Math.floor(playerState.exp / 100)}</p>
                </div>
                <p className="ending-message">당신은 진정한 슬롯 RPG의 마스터입니다!</p>
            </div>
            <button 
                className="btn btn-restart"
                onClick={onRestart}
                data-testid="button-restart-ending"
            >
                🔄 새로운 모험 시작
            </button>
        </div>
    );
}