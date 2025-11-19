function PlayerStatus({ player, stage }) {
    return (
        <div className="player-status combat-element">
            <div className="stat-item">
                <span className="stat-label">HP</span>
                <span className="stat-value" id="player-hp-value" data-testid="player-hp">
                    {Math.max(0, Math.floor(player.hp))} / {player.maxHP}
                </span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">DF</span>
                <span className="stat-value" id="player-df" data-testid="player-defense">
                    {Math.floor(player.df)}
                </span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">GOLD</span>
                <span className="stat-value" id="player-gold" data-testid="player-gold">
                    {Math.floor(player.gold)}
                </span>
            </div>
            
            <div className="stat-item">
                <span className="stat-label">STAGE</span>
                <span className="stat-value" data-testid="player-stage">{stage}</span>
            </div>
        </div>
    );
}

export default PlayerStatus;