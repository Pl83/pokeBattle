
//FRONT

let prenom = document.getElementById("prenom");
let pokemon = document.getElementById("pokemon");
function seeform(id) {

    if (id == 3) {
        prenom.classList.add("activeform")
    }
    else if (id == 1) {

        pokemon.classList.add("activeform")

    }
}
function sendform(id) {
    if (id == 1) {
        const pokemon = document.getElementById("Nimg").value;
        localStorage.setItem("favpokemon", pokemon);
    }

    else if (id == 3) {
        const prenom = document.getElementById("Nprenom").value;
        localStorage.setItem("pseudo", prenom);
    }
}

let Pprenom = document.getElementById("Pprenom");

let Pimg = document.getElementById("Pimg");

Pprenom.innerHTML = localStorage.getItem("pseudo");

fetch('https://pokeapi.co/api/v2/pokemon/' + localStorage.getItem("favpokemon"))
    .then(response => response.json())
    .then(data => {
        Pimg.src= `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`

    })


function btn(){
    fetch('http://localhost:3000/logout', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },

    })
    let logout = fetch('http://localhost:3000/logout')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.querySelector(".getTeam").innerHTML += data.msg;
        });
    localStorage.setItem("pseudo", "");
    localStorage.setItem("favpokemon","" );
    localStorage.setItem("pokemon", "");
    document.location.href = "login.html";

}


function deletes(){
    fetch('http://localhost:3000/delete', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({user: localStorage.getItem("pseudo")})

    })
    localStorage.setItem("pseudo", "");
    localStorage.setItem("favpokemon","" );
    localStorage.setItem("pokemon", "");
    document.location.href = "login.html";

}