function SlotReel({ icon, isSpinning, isProcessing }) {
    return (
        <div className={`slot-reel-container ${isProcessing ? 'is-processing' : ''}`} data-testid="slot-reel">
            <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
                {icon}
            </div>
        </div>
    );
}

export default SlotReel;