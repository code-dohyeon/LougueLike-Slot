class Item {
    constructor() {
        this.multiplier = 1.0;
    }

    processSlotResult(resultArray, target, player) {
        let comboCheck = 0;
        for(let i = 0; i < resultArray.length - 1; i++) {
            if(resultArray[i] === resultArray[i+1]) {
                comboCheck++;
                if(comboCheck >= 2) {
                    this.multiplier = 3.0;
                    break;
                }
            }
            else comboCheck = 0;
        }
        
        

        for(let i = 0; i < resultArray.length; i++) {
            console.log(`슬롯${i + 1}번째 칸 (${resultArray[i].type})`);
            switch(resultArray[i].type) {
                case 'Attack':
                    target.hp -= resultArray[i].base_value * this.multiplier;
                    console.log(`${target.type}에게 ${player.atk}만큼의 공격!`);
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
    }
}

export default Item;
