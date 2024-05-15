
var MyPower = 0;
var YourPower = 0;
const SesionPseudo = localStorage.getItem("pseudo");
localStorage.setItem("Yourpokemon", '');

let randomNumbers = [];
for (let i = 0; i < 6; i++) {
  randomNumbers.push(Math.floor(Math.random() * 859) + 1);
}

localStorage.setItem("Yourpokemon", JSON.stringify(randomNumbers));



function MyTeam() {
  let MyTeam = localStorage.getItem("pokemon"+SesionPseudo);
  //console.log(MyTeam);
  let numbers = MyTeam.match(/\d+/g);
  //console.log(numbers);
  if (localStorage.getItem("pokemon"+SesionPseudo) != null && numbers != null) {
    numbers.forEach(element => {
      fetch('https://pokeapi.co/api/v2/pokemon/' + element)
      .then(response => response.json())
        .then(data => {
          //console.log(data)
          MyPower += data.stats[0].base_stat;
          MyPower += data.stats[1].base_stat;
          MyPower += data.stats[2].base_stat;
          MyPower += data.stats[3].base_stat;
          MyPower += data.stats[4].base_stat;
          MyPower += data.stats[5].base_stat;
          //console.log(MyPower);
        })
    });
    if(numbers) {
        let numbersString = numbers.join(',');
        let numbersArray = numbersString.split(',');
      for (let i = 0; i < numbersArray.length; i++) {
        let imgcontainer = document.querySelector('.myteam');
        imgcontainer.classList.remove('myteam');
        imgcontainer.classList.add(numbersArray[i]);
        imgcontainer.innerHTML = '';
        imgcontainer.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numbersArray[i]}.png">`;
      }
    }
  } else {
    MyPower = 0;
  }
}

MyTeam();


function YourTeam() {
  let YourTeam = localStorage.getItem("Yourpokemon");
  //console.log(YourTeam);
  let numbers = YourTeam.match(/\d+/g);
  //console.log(numbers);
  numbers.forEach(element => {
    fetch('https://pokeapi.co/api/v2/pokemon/' + element)
    .then(response => response.json())
      .then(data => {
        //console.log(data)
        YourPower += data.stats[0].base_stat;
        YourPower += data.stats[1].base_stat;
        YourPower += data.stats[2].base_stat;
        YourPower += data.stats[3].base_stat;
        YourPower += data.stats[4].base_stat;
        YourPower += data.stats[5].base_stat;
        //console.log(YourPower);
      })
  });
  if(numbers) {
      let numbersString = numbers.join(',');
      let numbersArray = numbersString.split(',');
    for (let i = 0; i < numbersArray.length; i++) {
      let imgcontainer = document.querySelector('.yourteam');
      imgcontainer.classList.remove('yourteam');
      imgcontainer.classList.add(numbersArray[i]);
      imgcontainer.innerHTML = '';
      imgcontainer.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numbersArray[i]}.png">`;
    }
  }
}

YourTeam();

function compare() {
  //console.log(MyPower);
  //console.log(YourPower);
  let placeolder = document.querySelector('.placeolder');
  placeolder.style.display = 'flex';
  let myteamStat = document.querySelector('#myteamStat');
  let yourteamStat = document.querySelector('#yourteamStat');

  
    let promise1 = new Promise((resolve) => {
      if (MyPower != 0){
      for (let i = 0; i < MyPower; i++) {
        setTimeout(function() {
          myteamStat.innerHTML = i+' cc';
          if (i === MyPower - 1) resolve();
        }, 3 * i);
      }
    } else {
      myteamStat.innerHTML = '0 cc';
      resolve();
    }
    });
  
  
  let promise2 = new Promise((resolve) => {
    for (let i = 0; i < YourPower; i++) {
      setTimeout(function() {
        yourteamStat.innerHTML = i + ' cc';
        if (i === YourPower - 1) resolve();
      }, 3 * i);
    }
  });
  
  Promise.all([promise1, promise2]).then(() => {
    if (MyPower > YourPower) {
      myteamStat.style.fontSize = "40px";
      yourteamStat.style.fontSize = "15px";
      alert('The battle is over ! You Win !');
    } else if (MyPower < YourPower) {
      myteamStat.style.fontSize = "15px";
      yourteamStat.style.fontSize = "40px";
      alert('The battle is over ! You Lose !');
    } else {
      myteamStat.style.fontSize = "larger";
      yourteamStat.style.fontSize = "larger";
      alert('The battle is over ! It\'s a draw !');
    }
    
  });
  
}

const socket = io('http://localhost:3000');
socket.on("pokemonData", (data) => {
  //console.log('prochaineconsole');
  //console.log(data);
  let pokemon = data.split(',');
  //console.log(pokemon);
});


// Check the value of the "pokemon" key in an interval
setInterval(checkLocalStorage, 500); // check every 500 milliseconds