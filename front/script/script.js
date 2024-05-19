//`<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numbersArray[i]}.png">`
console.log(localStorage.getItem('PokeTrainer'));
localStorage.removeItem('room');
let user = localStorage.getItem('PokeTrainer');
user = JSON.parse(user);
console.log(user);
let team = user.poketeam;
console.log(team);
let teamSlots = document.querySelectorAll(".slot");
for (let i = 1; i < 7; i++) {
  let slot = teamSlots[i - 1];
  fetch(`https://pokeapi.co/api/v2/pokemon/${team[i]}`)
    .then(response => response.json())
    .then(data => {
      let img = document.createElement("img");
      img.src = data.sprites.front_default;
      slot.appendChild(img);
      let btn = document.createElement("button");
      btn.textContent = "Remove";
      slot.appendChild(btn);
      btn.addEventListener("click", () => {
        let user = localStorage.getItem('PokeTrainer');
        user = JSON.parse(user);
        slot.innerHTML = "";

        user.poketeam[i] = '';

        fetch('http://localhost:3000/myTeam', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'data': JSON.stringify(user)
            }
          }).then(response => response.json())
          user = JSON.stringify(user);

          localStorage.setItem('PokeTrainer', user);
      });
    });
}


function sendMessage() {
  let message = document.getElementById("contentmessage").value;
  console.log(message);
  let by = localStorage.getItem('PokeTrainer');
  by = JSON.parse(by);
  console.log(by);
  console.log(by.user);
  message = `${by.user}: ${message}`;
  let chat = document.querySelector(".showmessagedata");
  chat.innerHTML += `<p>${message}</p>`;
  socket.emit("message", message);
}

socket.on('message', (msg) => {
  console.log('message: ' + msg);
  let chat = document.querySelector(".showmessagedata");
  chat.innerHTML += `<p>${msg}</p>`;
});

const main = document.querySelector("main");
const boxarea = document.querySelector(".boxarea");
let x = 0;
let y = 0;
let usedNB = [];
while (y < main.clientHeight) {

  let nb = Math.floor(Math.random() * 898) + 1;
  while (usedNB.includes(nb)) {
    nb = Math.floor(Math.random() * 898) + 1;
  }
  usedNB.push(nb);
  
  const div = document.createElement("div");
  div.style.width = "50px";
  div.style.height = "50px";

  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.classList.add("boxpoke");

  div.classList.add("27");
  div.innerHTML = `<img class="pokemon drag${nb}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nb}.png">`;
  boxarea.appendChild(div);

  x += 65; // 50px (width) + 15px (gap)
  if (x + 50 > main.clientWidth) {
    x = 0;
    y += 65;
  }
}


// wait for the page to load
document.addEventListener("DOMContentLoaded", function() {
  let pokemons = document.querySelectorAll(".pokemon");
  let overlay = document.querySelector(".overlay");

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    let popupStatus = document.querySelector(".popupStatus");
    popupStatus.style.display = "none";
  });

  let popupStatus = document.querySelector(".popupStatus");
  console.log(pokemons);

pokemons.forEach(pokemon => {
  pokemon.addEventListener("click", (e) => {
    console.log('click');
    let teamSlots = document.querySelectorAll(".slot");
    let id = e.target.classList[1].substring(4);
    overlay.style.display = "block";
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let h2 = document.createElement("h2");
        h2.textContent = data.name;
        let img = document.createElement("img");
        img.src = data.sprites.front_default;
        img.alt = data.name;
        let ul = document.createElement("ul");
        let li1 = document.createElement("li");
        li1.textContent = `Type : ${data.types[0].type.name}`;
        let li2 = document.createElement("li");
        li2.textContent = `HP : ${data.stats[0].base_stat}`;
        let li3 = document.createElement("li");
        li3.textContent = `Attack : ${data.stats[1].base_stat}`;
        let li4 = document.createElement("li");
        li4.textContent = `Defense : ${data.stats[2].base_stat}`;
        let li5 = document.createElement("li");
        li5.textContent = `Special-attack : ${data.stats[3].base_stat}`;
        let li6 = document.createElement("li");
        li6.textContent = `Special-defense : ${data.stats[4].base_stat}`;
        let li7 = document.createElement("li");
        li7.textContent = `Speed : ${data.stats[5].base_stat}`;
        let label = document.createElement("label");
        label.textContent = "Add to slot :";
        let input = document.createElement("input");
        input.type = "number";
        input.id = "slot";
        input.min = 1;
        input.max = 6;
        let button = document.createElement("button");
        button.textContent = "Add to the teams";
        button.addEventListener("click", () => {
          let slotNb = input.value;
          let slotToplace = teamSlots[slotNb - 1];
          let img = document.createElement("img");
          let btn = document.createElement("button");
          btn.textContent = "Remove";
          btn.addEventListener("click", () => {
            slot.innerHTML = "";
            user.poketeam[slotToplace] = '';
            user = JSON.stringify(user);
            localStorage.setItem('PokeTrainer', user);
            fetch('http://localhost:3000/myTeam', {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                  'data': JSON.stringify(user)
                }
              }).then(response => response.json())
              user = JSON.stringify(user);
              localStorage.setItem('PokeTrainer', user);
          });
          img.src = data.sprites.front_default;
          img.alt = data.name;
          slotToplace.innerHTML = "";
          slotToplace.appendChild(img);
          slotToplace.appendChild(btn);
          overlay.style.display = "none";
          popupStatus.style.display = "none";
          let user = localStorage.getItem('PokeTrainer');
          user = JSON.parse(user);
          user.poketeam[slotNb] = data.name;
          console.log(user);
          fetch('http://localhost:3000/myTeam', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'data': JSON.stringify(user)
            }
          }).then(response => response.json())
          user = JSON.stringify(user);
          localStorage.setItem('PokeTrainer', user);
        });
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);
        ul.appendChild(li6);
        ul.appendChild(li7);
        popupStatus.textContent = "";
        popupStatus.appendChild(h2);
        popupStatus.appendChild(img);
        popupStatus.appendChild(ul);
        popupStatus.appendChild(label);
        popupStatus.appendChild(input);
        popupStatus.appendChild(button);
        popupStatus.style.display = "flex";
        overlay.style.display = "block";
      });
  });
});

});

