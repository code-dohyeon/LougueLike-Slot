import GameManager from "./gameManager.js";

const game = new GameManager();

const PLAYER_TURN_DELAY = 1000;
const MONSTER_TURN_DELAY = 1000;

const spinButton = document.getElementById('spin-button');
const gameStatusDiv = document.getElementById('game-status');
const playerGoldSpan = document.getElementById('player-gold');
const playerDfSpan = document.getElementById('player-df');
const playerHpSpan = document.getElementById('player-hp-value');
const restartButton = document.getElementById('restart-button');
const monsterInfoDiv = document.getElementById('monster-info');
const monsterHpFillDiv = document.getElementById('monster-hp-fill');
const slotContainerDiv = document.getElementById('slot-container');

const stageValueSpan = document.getElementById('stage-value');
const shopContainer = document.getElementById('shop-container');
const shopGoldValueSpan = document.getElementById('shop-gold-value');
const upgradeHpBtn = document.getElementById('upgrade-hp-btn');
const nextStageBtn = document.getElementById('next-stage-btn');
const clearTextDiv = document.getElementById('clear_text');
const upgradeSlotBtn = document.getElementById('upgrade-slot-btn'); // ✅ 슬롯 업그레이드 버튼 추가

const initialSetupContainer = document.getElementById('initial-setup-container');
const weaponSelectionDiv = document.getElementById('weapon-selection-div');
const selectWeaponsBtn = document.getElementById('select-weapons-btn');

// 💡 5개 릴 모두 참조
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3'),
    document.getElementById('reel-4'),
    document.getElementById('reel-5')
]

const itemEmogiMap = {
    'Attack': '⚔️',
    'Defense': '🛡️',
    'Resource': '💰'
}

function startSpinning() {
    spinButton.disabled = true;
    
    // 💡 player.slotCount 만큼의 릴만 회전 시작
    for(let i = 0; i < game.player.slotCount; i++) {
        const reel = reels[i];
        reel.textContent = '🎰'; // 회전 중 표시
        reel.classList.add('spinning');
    }
}

function stopSpinning(results) {
    // 💡 활성화된 릴만 멈추고 결과를 표시
    results.forEach((item, index) => {
        const reel = reels[index];
        reel.classList.remove('spinning');

        reel.textContent = itemEmogiMap[item.type];
    });

    spinButton.disabled = false;
    updateUI(results);
}

function updateUI(slotResults = null) {
    if(game.gameState === "InitialSetup") {
        gameStatusDiv.style.display = 'none';
        shopContainer.style.display = 'none';
        spinButton.style.display = 'none';

        slotContainerDiv.style.display = 'none';

        initialSetupContainer.style.display = 'block';
        return;
    } else if(game.gameState === "Combat") {
        gameStatusDiv.style.display = 'block';
        spinButton.style.display = 'block';   
        slotContainerDiv.style.display = 'flex';

    } else if(game.gameState === "UpgradeShop") {
        gameStatusDiv.style.display = 'none';
        spinButton.style.display = 'none';    
    }
    
    
    if(game.gameState !== "InitialSetup") {
        initialSetupContainer.style.display = 'none';

    }
    
    playerHpSpan.textContent = Math.max(0, game.player.hp);
    playerDfSpan.textContent = game.player.df;
    playerGoldSpan.textContent = game.player.gold;

    stageValueSpan.textContent = game.stage;

    // 몬스터 정보 업데이트 (기존 로직 유지)
    const maxHP = game.currentMonster.maxHp;
    const currentHP = Math.max(0, game.currentMonster.hp);
    const hpPercent = (currentHP / maxHP) * 100;

    monsterInfoDiv.innerHTML = `
        ${game.currentMonster.icon} ${game.currentMonster.type} (공격력: ${game.currentMonster.atk})
    `
    monsterHpFillDiv.style.width = `${hpPercent}%`;

    if(currentHP === 0) {
        monsterInfoDiv.textContent = `${game.currentMonster.icon} ${game.currentMonster.type} 💀 처치!`;
    }

    // 💡 릴 상태 제어 로직 (가장 중요한 부분!)
    reels.forEach((reel, index) => {
        if(index >= game.player.slotCount) {
            // 비활성화된 릴: 항상 '?'와 disabled 스타일 유지
            reel.textContent = '?';
            reel.classList.add('disabled-reel');
            reel.classList.remove('active-reel');
            reel.classList.remove('spinning');
        } else {
            // 활성화된 릴
            reel.classList.remove('disabled-reel');
            reel.classList.add('active-reel');

            if(slotResults && slotResults[index]) {
                // 슬롯 멈춘 후: 결과 이모지 표시
                reel.textContent = itemEmogiMap[slotResults[index].type];
            } else if(!reel.classList.contains('spinning')) {
                // 돌리기 전 초기 상태: 빈 문자열 ('')로 시작
                reel.textContent = '';
            }
            // 회전 중일 때는 startSpinning에서 설정한 '🎰'가 유지됨.
        }
    });

    // 💡 HP 업그레이드 버튼 상태 업데이트
    if(game.player.gold >= 50) {
        upgradeHpBtn.disabled = false;
        upgradeHpBtn.textContent = '최대 HP +10 (50 Gold)';
    } else {
        upgradeHpBtn.disabled = true;
        upgradeHpBtn.textContent = '최대 HP +10 (50 Gold)';
    }

    // 💡 슬롯 업그레이드 버튼 상태 업데이트
    if (game.player.slotCount >= 5) {
        upgradeSlotBtn.textContent = '최대 슬롯 해금';
        upgradeSlotBtn.disabled = true;
    } else if (game.player.gold >= 100) {
        upgradeSlotBtn.textContent = `슬롯 개수 +1 (100 Gold)`;
        upgradeSlotBtn.disabled = false;
    } else {
        upgradeSlotBtn.textContent = `슬롯 개수 +1 (100 Gold)`;
        upgradeSlotBtn.disabled = true;
    }
    
    // ❌ 에러를 발생시켰던 무한 재귀 호출을 제거했습니다.
    // updateUI(); 
}

function handleWin() {
    game.gameState = "UpgradeShop";
    spinButton.style.display = 'none';
    clearTextDiv.textContent = `✨ STAGE ${game.stage - 1} CLEAR! ✨`;
    clearTextDiv.style.display = 'block';
    slotContainerDiv.style.display = 'none';


    shopGoldValueSpan.textContent = game.player.gold;
    
    // 💡 릴 숨김 제거: 5개 릴이 계속 보이도록 (CSS로 비활성화 상태 유지)
    // reels.forEach(reel => reel.style.display = 'none'); 

    gameStatusDiv.style.display = 'none';
    shopContainer.style.display = 'block';
}

spinButton.addEventListener('click', () => {
    startSpinning();

    const hpBeforeTurn = game.player.hp;

    setTimeout(() => {
        const { status, results } = game.startTurn();
        stopSpinning(results); 

        const isAttack = results.some(item => item.type === 'Attack');
        const isDefense = results.some(item => item.type === 'Defense');
        const isResource = results.some(item => item.type === 'Resource');

        if(isAttack) {
            gameStatusDiv.classList.add('hit');
            setTimeout(() => { gameStatusDiv.classList.remove('hit'); }, 250);
        }

        if(isDefense) {
            playerDfSpan.classList.add('shield-gain');
            setTimeout(() => { playerDfSpan.classList.remove('shield-gain'); }, 400);
        }

        if(isResource) {
            playerGoldSpan.classList.add('gold-gain');
            setTimeout(() => { playerGoldSpan.classList.remove('gold-gain'); }, 400);
        }

        updateUI(results); // 💡 여기서 results를 넘겨서 최종 결과가 UI에 반영되도록 합니다.

        const hpAfterTurn = game.player.hp;

        if(hpAfterTurn < hpBeforeTurn) {
            playerHpSpan.classList.add('hit-taken');
            setTimeout(() => { playerHpSpan.classList.remove('hit-taken'); }, 300);
        }

        if(game.player.hp <= 0) {
            handleGameOver();
        }

        if (status === 'win') {
            handleWin();
        } else if(status === 'lose') {
            handleGameOver();
        }
    }, 1000);
    
});


nextStageBtn.addEventListener('click', () => {
    shopContainer.style.display = 'none';
    clearTextDiv.style.display = 'none';
    spinButton.style.display = 'block';
    gameStatusDiv.style.display = 'block';
    slotContainerDiv.style.display = 'flex';

    // 💡 릴 숨김 제거
    // reels.forEach(reel => reel.style.display = 'inline-block'); 

    game.prepareNextCombat();
    updateUI();
});

// 💡 슬롯 업그레이드 이벤트 리스너 수정
upgradeSlotBtn.addEventListener('click', () => {
    if(game.player.slotCount < 5 && game.player.gold >= 100) {
        game.player.gold -= 100;
        game.player.slotCount++;

        shopGoldValueSpan.textContent = game.player.gold;

        updateUI(); // 릴 개수 변경 후 UI 업데이트
        alert(`슬롯 개수가 ${game.player.slotCount}개로 증가했습니다!`);

    } else if(game.player.slotCount >= 5) {
        alert("이미 최대 슬롯 개수입니다.!");
    } else {
        alert("골드가 부족합니다!");
    }
});

upgradeHpBtn.addEventListener('click', () => {
    if(game.player.gold >= 50) {
        game.player.gold -= 50;
        game.player.maxHP += 10;
        game.player.hp = game.player.maxHP;

        shopGoldValueSpan.textContent = game.player.gold;
        alert("최대 HP가 10 증가하고 HP가 모두 회복되었습니다!");
        updateUI(); // HP 업데이트 후 UI 반영
    } else {
        alert("골드가 부족합니다!");
    }
});

function handleGameOver() {
    spinButton.disabled = true;

    gameStatusDiv.innerHTML = "💀 **GAME OVER** 💀"; 
    
    document.body.classList.add('game-over');

    restartButton.style.display = 'block';
}

function restartGame() {
    window.location.reload();
}

function renderWeaponSelection() {
    weaponSelectionDiv.innerHTML = '';
    
    // 💡 해금된 무기 ID 목록을 가져옴
    const unlockedIds = game.player.unlockedWeapons; 
    
    // 💡 모든 무기 목록에서 해금된 무기만 필터링하여 보여줌
    const allEquipment = game.allEquipment; // GameManager에서 이름을 allEquipment로 변경하면 좋지만, 일단 그대로 사용
    const displayEquipment = allEquipment.filter(item => unlockedIds.includes(item.id));

    displayEquipment.forEach(equipment => { // 'weapon' 대신 'equipment'로 변수명 변경
        const itemDiv = document.createElement('div');
        itemDiv.className = 'weapon-option';
        
        // 💡 텍스트 표시도 속성에 맞춰서 변경 (Defense/Resource도 표시)
        let displayValue = equipment.base_value;
        let displayAttr = equipment.type === 'Attack' ? 'ATK' : (equipment.type === 'Defense' ? 'DEF' : 'Gold');
        
        itemDiv.textContent = `${equipment.name} (${displayAttr}: ${displayValue})`;
        itemDiv.dataset.id = equipment.id;
        
        itemDiv.addEventListener('click', () => toggleWeaponSelection(itemDiv));
        weaponSelectionDiv.appendChild(itemDiv);
    });
}

let selectedWeaponIds = [];
function toggleWeaponSelection(element) {
    const id = element.dataset.id;
    const maxSelection = 3;

    if (selectedWeaponIds.includes(id)) {
        // 이미 선택된 경우: 선택 취소
        selectedWeaponIds = selectedWeaponIds.filter(wid => wid !== id);
        element.classList.remove('selected');
    } else if (selectedWeaponIds.length < maxSelection) {
        // 선택 가능: 선택
        selectedWeaponIds.push(id);
        element.classList.add('selected');
    }

    // 버튼 활성화/비활성화
    selectWeaponsBtn.disabled = selectedWeaponIds.length !== maxSelection;
    selectWeaponsBtn.textContent = `장비 ${selectedWeaponIds.length}/3개 선택 완료`;
}

restartButton.addEventListener('click', restartGame);

selectWeaponsBtn.addEventListener('click', () => {
    if (selectedWeaponIds.length === 3) {
        game.setInitialWeapons(selectedWeaponIds); // 게임 매니저에게 선택 전달
        
        // UI를 전투 화면으로 전환하고 몬스터 정보 업데이트
        updateUI(); 
        
        // 참고: 몬스터 정보 업데이트 후, 릴도 새로고침해야 함 (prepareNextCombat 호출 시 릴이 빈 상태로 되도록)
        
    } else {
        alert("3개의 무기를 선택해야 게임을 시작할 수 있습니다!");
    }
});

renderWeaponSelection();
updateUI(); // 💡 초기 릴 상태를 빈 상태와 '?'로 설정하기 위해 딱 한 번만 호출합니다.