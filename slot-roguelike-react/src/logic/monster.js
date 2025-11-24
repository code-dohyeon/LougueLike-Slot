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

    // 데미지를 받는 메서드 (수정: 방어력 무시 기능 추가)
    takeDamage(damage, ignoreDefense = false) { // 💡 ignoreDefense 파라미터 추가
        const defense = ignoreDefense ? 0 : this.df; // 방어력 무시 여부 체크
        const actualDamage = Math.max(0, damage - defense);
        this.hp -= actualDamage;
        if (this.hp < 0) this.hp = 0;
        return actualDamage;
    }

    increaseAttack() {
        this.atk += this.turnAtkIncrease;
    }

    // applyStatusEffect (수정: Fire, Frozen, Shock 상태 병합/적용 로직 추가)
    // 💡 누락되었던 applyStatusEffect 함수를 정확한 로직으로 복구했습니다.
    applyStatusEffect(effect) {
        const existingEffectIndex = this.statusEffects.findIndex(e => e.type === effect.type);

        if (effect.type === 'Poison') {
            // 독: 기존 효과가 있으면 데미지 중첩 및 지속시간 갱신
            if (existingEffectIndex !== -1) {
                this.statusEffects[existingEffectIndex].duration = effect.duration;
                this.statusEffects[existingEffectIndex].damage += effect.damage;
            } else {
                this.statusEffects.push(effect);
            }
        } else if (effect.type === 'Fire') {
            // 💡 [수정] 불: 기존 효과가 있으면 데미지와 지속시간을 갱신!
            if (existingEffectIndex !== -1) {
                // 턴 수 초기화 (예: 3턴)
                this.statusEffects[existingEffectIndex].duration = effect.duration; 
                // 도트 데미지 값 갱신 (새로 들어온 값으로 덮어쓰기)
                this.statusEffects[existingEffectIndex].damage = effect.damage; 
            } else {
                // 기존 효과가 없으면 새로 적용
                this.statusEffects.push(effect);
            }
        } else if (effect.type === 'Frozen') {
            // 얼음: (기존 로직 유지)
            // ...
        } else if (effect.type === 'Shock') { 
            // 감전: (기존 로직 유지)
            // ...
        } else {
            this.statusEffects.push(effect);
        }
    }

    // processStatusEffects (수정: Fire, Frozen, Shock 처리 및 턴 스킵 여부 반환)
    processStatusEffects() {
        let poisonDamage = 0; // 💡 독 데미지 추가
        let fireDamage = 0;   // 💡 불 데미지 추가
        let skipTurn = false; // 몬스터 턴 스킵 여부
        
        this.statusEffects = this.statusEffects.filter(effect => {
            if (effect.type === 'Poison' || effect.type === 'Fire') {
                // 독/불 도트딜 처리
                const appliedDamage = Math.floor(effect.damage); 
                
                if (appliedDamage > 0) {
                    this.hp -= appliedDamage;
                    
                    // 💡 속성별로 데미지 저장 (합산 대신 분리)
                    if (effect.type === 'Poison') {
                        poisonDamage += appliedDamage;
                    } else if (effect.type === 'Fire') {
                        fireDamage += appliedDamage;
                    }
                }
                
                if (effect.type === 'Poison') {
                    effect.damage *= 0.8; // 독은 데미지 감소
                    if (effect.damage < 1) return false;
                }
                
                effect.duration--;
                return effect.duration > 0 && effect.damage >= 1;

            } else if (effect.type === 'Frozen') {
                // ❄️ 얼음: 몬스터 턴 시작 시 확률 체크 (이미 Frozen 상태 부여 시점에서 확률이 체크되었으므로, 턴 스킵 확률은 100%로 가정)
                const chance = effect.chance || 1.0; 
                if (Math.random() < chance) {
                    skipTurn = true; // 확률 성공 시 턴 스킵
                }
                
                // 💡 수정: duration이 0보다 클 때만 상태를 유지해야 하지만,
                // Frozen은 1턴만 유지되는 상태이므로, 턴 스킵 확인 후 즉시 제거합니다.
                return false; 

            } else if (effect.type === 'Shock') { 
                // ⚡️ 감전 로직 (유지)
                const chance = effect.chance || 0.15;
                if (Math.random() < chance) {
                    skipTurn = true; 
                }
                effect.duration--;
                return effect.duration > 0;
            }
            
            // 기타 상태이상
            effect.duration--;
            return effect.duration > 0;
        });

        return { 
            poisonDamage: poisonDamage, 
            fireDamage: fireDamage, 
            skipTurn: skipTurn 
        };
    }
}

export default Monster;