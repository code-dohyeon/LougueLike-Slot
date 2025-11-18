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

    // 💡 몬스터 턴 시작 시 상태 효과 처리 (독 피해 20% 감소 로직 적용)
    processStatusEffects() {
        let totalDamage = 0;
        
        this.statusEffects = this.statusEffects.filter(effect => {
            if (effect.type === 'Poison') {
                
                const appliedDamage = Math.floor(effect.damage); 
                
                if (appliedDamage <= 0) {
                    return false; // 피해량이 0 이하면 제거
                }
                
                this.hp -= appliedDamage; // 몬스터 HP 감소!
                totalDamage += appliedDamage;
                
                // 💡 [요청 반영] 독 데미지 20% 감소 (다음 턴 예상 피해량 업데이트)
                effect.damage *= 0.8; 
                
                const shouldKeep = effect.damage >= 1; // 1 미만이면 제거
                
                if (!shouldKeep) {
                     console.log(`[독 제거] ${this.type}의 독 효과가 피해량 감소로 제거되었습니다.`);
                } else {
                    console.log(`[독 피해] ${this.type}이(가) 독으로 ${appliedDamage} 피해를 입었습니다. (다음 턴 예상 피해량: ${effect.damage.toFixed(2)})`);
                }
                
                return shouldKeep;
            }
            
            // 독 외 다른 상태 효과는 기존 duration 기반 로직 유지
            effect.duration--;
            return effect.duration > 0;
        });

        return totalDamage; 
    }
}

export default Monster;
