localStorage.removeItem('room');
displayRoom()

function createRoom() {
    let user = localStorage.getItem('PokeTrainer');
    user = JSON.parse(user);
    user = user.user;
    socket.emit('room', {roomName: user}, {msg: user + ' has created a room'});
    localStorage.setItem('room', user)
    console.log('room created');
    displayRoom();
    window.location.href = "battle.html";
}

function joinRoom(roomName) {
    //socket.emit('join', roomName);
    localStorage.setItem('room', roomName);
    window.location.href = "battle.html";
}

function displayRoom() {
    fetch('http://localhost:3000/rooms', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        let roomList = document.querySelector(".room-list");
        roomList.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let room = data[i];
            let roomDiv = document.createElement("div");
            let h3 = document.createElement("h3");
            let btn = document.createElement("button");
            let p = document.createElement("p");
            h3.textContent = 'Room of ' + room.roomName;
            p.textContent = '1/2';
            btn.textContent = "Join";
            btn.addEventListener("click", () => {
                console.log('join room');
                joinRoom(room.roomName);
            });
            roomDiv.appendChild(h3);
            roomDiv.appendChild(p);
            roomDiv.appendChild(btn);
            
            
            roomList.appendChild(roomDiv);
        }
    });
}