localStorage.clear();

function register(){

    let user = document.querySelector("#userr").value;
    let password = document.querySelector("#passe").value;
    let pokfa= document.querySelector("#favor").value;
    let pokeTeam = {1: '', 2: '', 3: '', 4: '', 5: '', 6: ''};
    let genre = 'humain'
    let data = JSON.stringify({user: user, password: password ,pokefavs: pokfa, poketeam: pokeTeam, genre: genre})

    fetch('http://localhost:3000/register', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'data': data
        }
    }).then(response => response.json())
    .then(data => {

        if (data.sucess){
            let user = data.sucess;
            console.log(user);
            user = JSON.stringify(user);
            localStorage.setItem('PokeTrainer', user);
            window.location.href = "index.html";
        } else {
            alert(data.sucess);
        }
    });

}


function login(){

    let user = document.querySelector("#userl").value;
    let password = document.querySelector("#pass").value;

    let data = JSON.stringify({user: user, password: password})

    fetch('http://localhost:3000/login/', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'data': data
        }

    }).then(response => response.json())
    .then(data => {
        if (data.sucess){
            let user = data.sucess;
            console.log(user);
            user = JSON.stringify(user);
            localStorage.setItem('PokeTrainer', user);
            window.location.href = "index.html";
        } else {
            alert('User or password incorrect');
        }
    });
        
}
