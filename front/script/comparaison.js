socket.emit('join', localStorage.getItem('room'))

function clear(){
    localStorage.remove('room')
}

let i = 0;

let player = localStorage.getItem('PokeTrainer');
let trainer = null ;
socket.on('getAdversary', () => {
    console.log('getAdversary');
    socket.emit('sendAdversary', player)
})

socket.on('returnAdversary', (adversary) => {
    trainer = adversary;
    console.log('adversary: ' + adversary);
    adversary = JSON.stringify(adversary);
    localStorage.setItem('trainer', adversary);
    socket.emit('fix', player, trainer)
})

socket.on('fixed', (player, trainer) => {
    console.log('fixed');
    console.log(player.user);
    console.log(trainer.user);
    
    if (localStorage.getItem('pokeTrainer') !== player) {
        localStorage.setItem('player', player);
        localStorage.setItem('trainer', trainer);
    } else {
        localStorage.setItem('player', trainer);
        localStorage.setItem('trainer', player);
    }
})



// battle

let playerZone = document.querySelector('.player');
let trainerZone = document.querySelector('.trainer');

let myHp = document.querySelector('#myHp')
let hisHp = document.querySelector('#hisHp')

let currentPoke = document.querySelector('#currentPoke')
let currentEnnemie = document.querySelector('#currentEnnemie')

let currentPokeStats = null;
let currentEnnemieStats = null;

let playerTeams = JSON.parse(localStorage.getItem('player')).poketeam;
let trainerTeams = JSON.parse(localStorage.getItem('trainer')).poketeam;

playerTeams = Object.values(playerTeams);
trainerTeams = Object.values(trainerTeams);

playerTeams = playerTeams.filter(poke => poke !== '');
trainerTeams = trainerTeams.filter(poke => poke !== '');

console.log(playerTeams);
console.log(trainerTeams);

// for eache pokemon use the poke api to get the stats

let playerPoke = playerTeams[i];
let trainerPoke = trainerTeams[i];

fetch('https://pokeapi.co/api/v2/pokemon/' + playerPoke)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        currentPoke.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${data.id}.png`
        myHp.max = data.stats[0].base_stat;
        myHp.value = data.stats[0].base_stat;  
        currentPokeStats = data.stats;  
})

fetch('https://pokeapi.co/api/v2/pokemon/' + trainerPoke)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        currentEnnemie.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
        
        hisHp.max = data.stats[0].base_stat;
        hisHp.value = data.stats[0].base_stat;
        currentEnnemieStats = data.stats;
})

let turn = true;

function attack(stats, statsEnnemie) {
    let attack = stats[1].base_stat;
    let defense = statsEnnemie[2].base_stat;
    let damage = attack - defense;
    if (damage < 0) {
        damage = 0;
    }
    return damage;
}

function run(teamOne, teamTwo) {
    if (turn) {
        let damage = attack(currentPokeStats, currentEnnemieStats);
        hisHp.value -= damage;
        turn = false;
        if (hisHp.value <= 0) {
            i++;
            if (i < teamTwo.length) {
                trainerPoke = teamTwo[i];
                fetch('https://pokeapi.co/api/v2/pokemon/' + trainerPoke)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        currentEnnemie.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
                        hisHp.max = data.stats[0].base_stat;
                        hisHp.value = data.stats[0].base_stat;
                        currentEnnemieStats = data.stats;
                })
            } else {
                alert('You win');
                window.location.href = 'index.html';
            }
        }
    } else {
        let damage = attack(currentEnnemieStats, currentPokeStats);
        myHp.value -= damage;
        turn = true;
        if (myHp.value <= 0) {
            i++;
            if (i < teamOne.length) {
                playerPoke = teamOne[i];
                fetch('https://pokeapi.co/api/v2/pokemon/' + playerPoke)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        currentPoke.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
                        myHp.max = data.stats[0].base_stat;
                        myHp.value = data.stats[0].base_stat;
                        currentPokeStats = data.stats;
                })
            } else {
                alert('You lose');
                window.location.href = 'index.html';
            }
        }
    }
}

run(playerTeams, trainerTeams)