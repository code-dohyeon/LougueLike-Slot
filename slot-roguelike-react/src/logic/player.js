class Player {
    constructor() {
        this.hp = 100;
        this.maxHP = 100;
        this.df = 0;
        this.atk = 10;
        this.gold = 0;
        this.slotCount = 3;
        this.maxExp = 100;
        this.exp = 0; // 시작 경험치를 0으로 수정
        this.level = 0;
        this.equippedWeapons = [];
        this.unlockedWeapons = ['SWD_01', 'SHD_01', 'RSC_01'];
        this.statusEffects = [];
        
        this.weaponUpgradeLevels = {}; // { weaponId: upgradeLevel }
    }

    takeDamage(rawDamage) {
        let absorbedDamage = Math.min(rawDamage, this.df);
        this.df -= absorbedDamage;
        let finalDamageToHP = rawDamage - absorbedDamage;
        this.hp -= finalDamageToHP;
        return finalDamageToHP;
    }
}

export default Player;