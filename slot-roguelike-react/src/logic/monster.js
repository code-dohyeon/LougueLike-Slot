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
        this.chapter = data.chapter;
        
        this.statusEffects = [];
    }

    // 데미지를 받는 메서드 (새로 추가)
    takeDamage(damage) {
        const actualDamage = Math.max(0, damage - this.df);
        this.hp -= actualDamage;
        if (this.hp < 0) this.hp = 0;
        return actualDamage;
    }

    // 독 상태 적용 (새로 추가)
    applyPoison(poisonAmount) {
        const existingPoison = this.statusEffects.find(e => e.type === 'Poison');
        
        if (existingPoison) {
            existingPoison.duration = 3;
            existingPoison.damage += poisonAmount;
        } else {
            this.statusEffects.push({
                type: 'Poison',
                damage: poisonAmount,
                duration: 3
            });
        }
    }

    increaseAttack() {
        this.atk += this.turnAtkIncrease;
    }

    applyStatusEffect(effect) {
        const existingPoison = this.statusEffects.find(e => e.type === 'Poison');
        
        if (existingPoison && effect.type === 'Poison') {
            existingPoison.duration = effect.duration;
            existingPoison.damage += effect.damage;
        } else {
            this.statusEffects.push(effect);
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
                
                return effect.damage >= 1;
            }
            
            effect.duration--;
            return effect.duration > 0;
        });

        return totalDamage; 
    }
}

export default Monster;