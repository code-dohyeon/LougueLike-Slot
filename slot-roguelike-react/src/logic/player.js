class Player {
    constructor() {
        this.hp = 100;
        this.maxHP = 100;
        this.df = 0; // 방어력
        this.atk = 10;
        this.gold = 0;
        this.slotCount = 3; 

        this.equippedWeapons = []; 
        
        // 💡 수정: 초기 해금 장비 목록을 3가지 아이템으로 변경
        this.unlockedWeapons = ['SWD_01', 'SHD_01', 'RSC_01']; 
        
        this.statusEffects = [];
    }

    takeDamage(rawDamage) {
        // 1. 방어력으로 데미지 흡수
        let absorbedDamage = Math.min(rawDamage, this.df);
        this.df -= absorbedDamage; // 방어력 감소

        // 2. 최종 데미지 계산
        let finalDamageToHP = rawDamage - absorbedDamage;
        this.hp -= finalDamageToHP; // HP 감소

        return finalDamageToHP;
    }
}

export default Player;