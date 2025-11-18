class Item {
    constructor() {
        this.multiplier = 1.0;
    }

    processSlotResult(resultArray, target, player, multiplier) {
        this.multiplier = multiplier;


        let totalPhysicalDamage = 0;
        let totalPoisonDamage = 0;

        for(let i = 0; i < resultArray.length; i++) {
            console.log(`슬롯${i + 1}번째 칸 (${resultArray[i].type})`);

            const item = resultArray[i];
            const damageValue = item.base_value * this.multiplier;

            switch(item.type) {
                case 'Attack':
                    if (item.damage_type === 'Poison') {
                        // 몬스터에게 독 상태 효과 적용
                        target.applyStatusEffect({
                            type: 'Poison',
                            damage: damageValue, // 독 피해량 (고정)
                            duration: 3  // 독 지속 턴 (고정)
                        });

                        totalPoisonDamage += damageValue;
                        // console.log(`[독 공격] ${target.type}에게 독 상태를 적용합니다!`);
                        
                    } else if (item.damage_type === 'Physical') {
                        // 물리 공격 (기존 로직)
                        target.hp -= damageValue;
                        // console.log(`${target.type}에게 ${damageValue}만큼의 물리 공격!`);
                        totalPhysicalDamage += damageValue;

                    } else {
                        // damage_type이 정의되지 않은 경우 기본 물리 공격으로 처리
                        target.hp -= damageValue;
                        console.log(`${target.type}에게 ${damageValue}만큼의 일반 공격!`);
                    }
                    break;

                case 'Defense':
                    player.df += resultArray[i].base_value * this.multiplier;
                    console.log(`플레이어에게 ${resultArray[i].base_value}만큼의 상승!`);
                    console.log(`플레이어의 Sheild:${player.df}`);

                    break;

                case 'Resource':
                    player.gold += resultArray[i].base_value * this.multiplier;
                    console.log(`플레이어에게 ${resultArray[i].base_value}만큼의 골드 추가!`);
                    console.log(`플레이어의 Gold:${player.gold}`);

                    break;
            }
            console.log('\n\n');
        }
        console.log(`\n${target.type}의 HP:${Math.max(0, target.hp)}`);

        this.multiplier = 1.0;

        return {totalPhysicalDamage: totalPhysicalDamage, totalPoisonDamage: totalPoisonDamage};
    }
}

export default Item;
