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

    // --- 💡 독 로직 추가 1: 상태 효과 적용 ---
    // 💡 새로운 기능 1: 상태 효과(독)를 적용하는 메소드
    applyStatusEffect(effect) {
        // 현재는 독(Poison)만 처리한다고 가정
        const existingPoison = this.statusEffects.find(e => e.type === 'Poison');
        
        if (existingPoison) {
            // 🚨🚨🚨 수정된 로직: 피해량 누적 및 지속 시간 갱신! 🚨🚨🚨
            existingPoison.duration = effect.duration; // 지속 시간만 리셋 (3턴)
            existingPoison.damage += effect.damage;   // 피해량은 누적 (5 + 5 + 5 ...)
            
            console.log(`[독 중첩] ${this.type}의 독 피해량이 ${existingPoison.damage}로 누적, 지속 시간이 ${existingPoison.duration}턴으로 갱신!`);
        } else {
            this.statusEffects.push(effect);
            console.log(`[독 적용] ${this.type}에게 독 피해 ${effect.damage}가 ${effect.duration}턴 동안 적용되었습니다.`);
        }
    }

    // 💡 새로운 기능 2: 몬스터 턴이 시작될 때 상태 효과를 처리하고 피해를 주는 메소드 (이 로직은 그대로 유지)
    processStatusEffects() {
        // ... (기존 로직 그대로)
        let totalDamage = 0;
        
        this.statusEffects = this.statusEffects.filter(effect => {
            if (effect.type === 'Poison') {
                const damage = effect.damage;
                this.hp -= damage;
                totalDamage += damage;
                effect.duration--; 
                
                console.log(`[독 피해] ${this.type}이(가) 독으로 ${damage} 피해를 입었습니다. (남은 턴: ${effect.duration})`);
                
                return effect.duration > 0;
            }
            return true;
        });

        return totalDamage; 
    }
}

export default Monster;