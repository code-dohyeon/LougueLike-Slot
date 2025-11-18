class Monster {
    constructor(data) {
        this.type = data.type;
        this.hp = data.hp;
        this.df = data.df;
        this.atk = data.atk;
        this.icon = data.icon;
        this.maxHp = data.hp;
        
        // 💡 새로 추가된 속성
        this.attackCount = data.attackCount || 1; 
        this.turnAtkIncrease = data.turnAtkIncrease || 0; 
        
        // 💡 몬스터가 받는 상태 효과 (예: 독)를 저장할 배열
        this.statusEffects = []; 
    }

    // 💡 몬스터의 턴이 끝날 때마다 공격력을 상승시키는 메소드 추가
    increaseAttack() {
        this.atk += this.turnAtkIncrease;
    }
}

export default Monster;