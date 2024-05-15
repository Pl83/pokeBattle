const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const {Server} = require("socket.io");

const httpServer = http.createServer(app);

const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:1234@cluster0.dya1mju.mongodb.net/?retryWrites=true&w=majority\n";
const client = new MongoClient(uri, { useNewUrlParser: true });




const io = new Server(httpServer, {
    cors : {
        origin : '*'
    }
});

// middelware
app.use(express.json());
app.use(cors());

// routes

io.on("connection", (socket) => {
  console.log('socketdataid log');
  console.log(socket)
  socket.on("message", (data) => {
    console.log('socketdata log');
    console.log(data);
    io.emit("Sendfront", data)
  })
  socket.on("pokemonData", function(data) {
    console.log("Received pokemon data:", data);
    io.emit("pokemonData", data);
    });
})

app.post('/login/', (req, res) => {
    console.log(req.body);
    console.log(req.body.user)
    console.log(req.body.password)
    res.json({user: req.body.user , pokes: req.body.pokfav});
});
app.post('/register/', (req, res) => {



    const username = req.body.user;
    const pokefa = req.body.pokefavs;
    const password = req.body.passwords;
    console.log(pokefa);


    client.connect(err => {
        const collection = client.db("user").collection("profile");
        collection.insertOne({ username: username, pokefav: pokefa, password: password }, function(err, res) {
            console.log("User created");
            client.close();
        });
    });


});



app.get('/logout/', (req, res) => {
    console.log("vous etes deconnecté");
    res.json({msg: "suppresion de compte"});
});

app.delete('/delete/', (req, res) => {


    client.connect(err => {
        const collection = client.db("user").collection("profile");
        const connectedUserId = req.body.user;
        console.log(connectedUserId);
        collection.deleteOne({ username: connectedUserId }, function(err, res) {
            console.log("Connected user's document deleted");
            client.close();
        });
    });

});

httpServer.listen(port, () => {
  console.log(`On écoute le port n°${port}`)
});


console.log(app)  

