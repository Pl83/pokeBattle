if (! localStorage.getItem('PokeTrainer')){
    window.location.href = "login.html";
}
const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log('connect');
});
