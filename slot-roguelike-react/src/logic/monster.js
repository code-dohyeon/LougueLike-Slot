class Monster {
    constructor(data) {
        this.type = data.type;
        this.hp = data.hp;
        this.df = data.df;
        this.atk = data.atk;
        this.icon = data.icon;
        this.maxHp = data.hp;
        
        this.attackCount = data.attackCount || 1; 
        this.turnAtkIncrease = data.turnAtkIncrease || 0; 
        
        this.isBoss = data.isBoss || false;
        this.goldReward = data.goldReward || 50;
        this.expReward = data.expReward || 10;
        
        this.statusEffects = []; 
    }

    increaseAttack() {
        this.atk += this.turnAtkIncrease;
    }

    applyStatusEffect(effect) {
        const existingPoison = this.statusEffects.find(e => e.type === 'Poison');
        
        if (existingPoison) {
            existingPoison.duration = effect.duration;
            existingPoison.damage += effect.damage;
            
            console.log(`[독 중첩] ${this.type}의 독 피해량이 ${existingPoison.damage}로 누적, 지속 시간이 ${existingPoison.duration}턴으로 갱신!`);
        } else {
            this.statusEffects.push(effect);
            console.log(`[독 적용] ${this.type}에게 독 피해 ${effect.damage}가 ${effect.duration}턴 동안 적용되었습니다.`);
        }
    }

    processStatusEffects() {
        let totalDamage = 0;
        
        this.statusEffects = this.statusEffects.filter(effect => {
            if (effect.type === 'Poison') {
                
                const appliedDamage = Math.floor(effect.damage); 
                
                if (appliedDamage <= 0) {
                    return false;
                }
                
                this.hp -= appliedDamage;
                totalDamage += appliedDamage;
                
                effect.damage *= 0.8; 
                
                const shouldKeep = effect.damage >= 1;
                
                if (!shouldKeep) {
                     console.log(`[독 제거] ${this.type}의 독 효과가 피해량 감소로 제거되었습니다.`);
                } else {
                    console.log(`[독 피해] ${this.type}이(가) 독으로 ${appliedDamage} 피해를 입었습니다. (다음 턴 예상 피해량: ${effect.damage.toFixed(2)})`);
                }
                
                return shouldKeep;
            }
            
            effect.duration--;
            return effect.duration > 0;
        });

        return totalDamage; 
    }
}

export default Monster;
