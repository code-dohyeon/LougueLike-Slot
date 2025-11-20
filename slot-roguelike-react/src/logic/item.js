// item.js (수정)

class Item {
    constructor() {
        this.multiplier = 1.0;
    }

    // 💡 이 함수는 이제 '데미지 적용' 대신 '상태 이상 및 버프 적용'에 집중
    processSlotResult(resultArray, target, player, multiplier) {
        this.multiplier = multiplier;

        // 데미지 관련 변수 제거 (데미지는 gameManager에서 처리)
        let defenseGain = 0;
        let goldGain = 0;
        
        // 💥 상태 이상으로 인한 데미지 팝업을 위해 속성별 데미지를 반환해야 한다면 로직을 다시 조정해야 함.
        // 여기서는 '상태 적용'에만 집중하고, 데미지 팝업은 gameManager에서 반환한 값을 쓰는 게 일반적임.
        // 현재는 '상태 이상' 적용에 필요한 반환값만 남김 (Defense, Resource)

        for(let i = 0; i < resultArray.length; i++) {
            const item = resultArray[i];
            const value = item.base_value * this.multiplier; // 상태 이상/버프에 사용되는 기본값

            switch(item.type) {
                case 'Attack':
                    // 💥 HP 직접 깎는 로직 제거 (target.hp -= physicalDmg;)
                    
                    switch(item.damage_type) {
                        case 'Poison': // 독: 몬스터 턴에 도트딜 (기존 로직 유지)
                            target.applyStatusEffect({
                                type: 'Poison',
                                damage: value,
                                duration: 3 // 3턴 동안 도트딜
                            });
                            break;
                            
                        case 'Fire': // 불: 때릴 때 데미지 + 몬스터 턴에 도트딜
                            target.applyStatusEffect({
                                type: 'Fire',
                                damage: value,
                                duration: 3
                            });
                            break;
                            
                        case 'Ice': // 얼음: 때릴 때 데미지 + 일정 확률로 몬스터 턴 스킵 (1턴)
                            const applyChance = 0.25; // 💡 25% 확률로 Frozen 상태 부여
                            if (Math.random() < applyChance) { // 💥 확률 체크! 참일 때만 Frozen 적용
                                target.applyStatusEffect({
                                    type: 'Frozen',
                                    // 몬스터 턴 스킵 확률은 80%로 가정하고 전달 (이 확률은 monster.js에서 사용됨)
                                    chance: 1.0,
                                    duration: 1 
                                });
                            }
                            break;
                            
                        case 'Lightning': // 전기: 때릴 때 데미지 + 감전 (5턴 동안 일정 확률로 몬스터 턴 스킵)
                            target.applyStatusEffect({
                                type: 'Shock', // 상태 이름 변경 (Frozen과 구분)
                                duration: 5,
                                chance: 0.15 // 15% 확률로 턴 스킵 (확률은 임의로 설정)
                            });
                            break;
                            
                        case 'Dark': // 암흑: 때릴 때 데미지 + 희박한 확률로 즉사
                            const instantKill = Math.random() < 0.05; // 5% 확률
                            if (instantKill) {
                                target.hp = 0; // 즉사 적용
                            }
                            break;
                            
                        // Holy, Magic, Physical은 기본 데미지 처리 외에 특별한 상태 이상 효과가 없으므로 pass
                    }
                    break;

                case 'Defense':
                    const dfGain = item.base_value * this.multiplier;
                    player.df += dfGain;
                    defenseGain += dfGain;
                    break;

                case 'Resource':
                    const resGain = item.base_value * this.multiplier;
                    player.gold += resGain;
                    goldGain += resGain;
                    break;
            }
        }

        this.multiplier = 1.0;
        
        // 💡 반환되는 값도 Defense와 Gold 획득량만 포함하도록 수정
        return {
            defenseGain: defenseGain,
            goldGain: goldGain
        };
    }
}

export default Item;