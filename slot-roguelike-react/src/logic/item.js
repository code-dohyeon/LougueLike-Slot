class Item {
    constructor() {
        this.multiplier = 1.0;
    }

    processSlotResult(resultArray, target, player, multiplier) {
        this.multiplier = multiplier;

        let totalPhysicalDamage = 0;
        let totalPoisonDamage = 0;
        let totalFireDamage = 0;
        let totalIceDamage = 0;
        let totalLightningDamage = 0;
        let totalHolyDamage = 0;
        let totalDarkDamage = 0;
        let totalMagicDamage = 0;

        for(let i = 0; i < resultArray.length; i++) {
            const item = resultArray[i];
            const damageValue = item.base_value * this.multiplier;

            switch(item.type) {
                case 'Attack':
                    const physicalDmg = damageValue;
                    target.hp -= physicalDmg;
                    totalPhysicalDamage += physicalDmg;

                    if (item.damage_type === 'Poison') {
                        target.applyStatusEffect({
                            type: 'Poison',
                            damage: damageValue,
                            duration: 3
                        });
                        totalPoisonDamage += damageValue;
                    } else if (item.damage_type === 'Fire') {
                        target.applyStatusEffect({
                            type: 'Fire',
                            damage: damageValue,
                            duration: 3
                        });
                        totalFireDamage += damageValue;
                    } else if (item.damage_type === 'Ice') {
                        target.applyStatusEffect({
                            type: 'Frozen',
                            duration: 1
                        });
                        totalIceDamage += damageValue;
                    } else if (item.damage_type === 'Lightning') {
                        target.applyStatusEffect({
                            type: 'Lightning',
                            damage: damageValue,
                            duration: 1
                        });
                        totalLightningDamage += damageValue;
                    } else if (item.damage_type === 'Holy') {
                        const holyDamage = target.maxHp * 0.1;
                        target.hp -= holyDamage;
                        totalHolyDamage += holyDamage;
                    } else if (item.damage_type === 'Dark') {
                        const instantKill = Math.random() < 0.05;
                        if (instantKill) {
                            target.hp = 0;
                            totalDarkDamage += target.maxHp;
                        }
                    } else if (item.damage_type === 'Magic') {
                        totalMagicDamage += damageValue;
                    }
                    break;

                case 'Defense':
                    player.df += resultArray[i].base_value * this.multiplier;
                    break;

                case 'Resource':
                    player.gold += resultArray[i].base_value * this.multiplier;
                    break;
            }
        }

        this.multiplier = 1.0;
        return {
            physicalDamage: totalPhysicalDamage,
            poisonDamage: totalPoisonDamage,
            fireDamage: totalFireDamage,
            iceDamage: totalIceDamage,
            lightningDamage: totalLightningDamage,
            holyDamage: totalHolyDamage,
            darkDamage: totalDarkDamage,
            magicDamage: totalMagicDamage
        };
    }
}

export default Item;