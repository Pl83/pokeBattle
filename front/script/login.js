function register(){
    let user = document.querySelector("#userr").value;
    let password = document.querySelector("#passe").value;

    const pokfa= document.querySelector("#favor").value;
    console.log(pokfa);


    fetch('http://localhost:3000/register', {
        method: "POST",

        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },

        body: JSON.stringify({user: user, passwords: password ,pokefavs: pokfa})


    })
}

console.log("bonjour");
function login(){
    let Rpassword = document.querySelector("#passe").value;
    const pokfav= document.querySelector("#favor").value;
    let user = document.querySelector("#userl").value;
    let password = document.querySelector("#pass").value;

    fetch('http://localhost:3000/login/', {
        method: "POST",

        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },

        body: JSON.stringify({user: user, password: password})

    })

    console.log(password)
    if (Rpassword == password && password.length > 0){
        console.log("mot de passe correct");
        localStorage.setItem('pseudo', user);
        localStorage.setItem('favpokemon', pokfav);
        document.location.href = "index.html";
    }
    else{
        alert("mot de passe incorrect");
    }
}
