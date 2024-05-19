import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';
import { client, collectionUser } from './connect.js';
import badWords from './lang.json'  assert { type: "json" };

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
        }
})

let rooms = [];

// Function to escape special characters in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
  
// Function to replace bad words in a string with asterisks
function censorBadWords(inputString) {
    let censoredString = inputString;

    badWords.words.forEach(badWord => {
    // Escape any special characters in the bad word
    const escapedBadWord = escapeRegExp(badWord);
    // Create a regular expression for the bad word, case insensitive
    const regex = new RegExp(`\\b${escapedBadWord}\\b`, 'gi');
    // Replace the bad word with asterisks
    censoredString = censoredString.replace(regex, '*'.repeat(badWord.length));
    });

    return censoredString;
}

app.use(cors())

app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address()+':'+PORT);    
});

app.get('/register', async (req, res) => {
    console.log('register');


    try {

        let data = JSON.parse(req.headers.data);
        let dataUsers = data.user;

        let password = data.password;

        let pokfav = data.pokefavs;

        let poketeam = data.poketeam;

        let genre = data.genre;

        let userExist = await collectionUser.findOne({user: dataUsers});
    
        if (userExist){
            res.json(false);
            return
        }

        await collectionUser.insertOne({user: dataUsers, password: password, pokefav: pokfav, poketeam: poketeam, genre: genre});

        let user = await collectionUser.findOne({user: dataUsers , password: password});
        delete user.password;
        delete user._id;
        console.log(user);
        res.json({'sucess': user});
        return 
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
        return 
    }

});

app.get('/login', async (req, res) => {
    console.log('login');

    let data = JSON.parse(req.headers.data);
    let user = data.user;
    let password = data.password;

    try {
        let userExist = await collectionUser.findOne({user: user, password: password});

        if (userExist){
            delete userExist.password;
            delete userExist._id;
            res.json({'sucess': userExist});
            return
        } else {
            res.json(false);
            return
        }
    } catch (error) {
        res.status(404).json(error);
        return
    }
});

app.get('/myTeam', async (req, res) => {
    console.log('myTeam');

    let data = JSON.parse(req.headers.data);
    console.log(data);
    let Datauser = data.user;
    let Newpoketeam = data.poketeam;


    try {
        let userExist = await collectionUser.findOne({user: Datauser});

        if (userExist){
            console.log('userExist');
            await collectionUser.updateOne({user: Datauser}, {$set: {poketeam: Newpoketeam}});
            let user = await collectionUser.findOne({user: Datauser});
            delete user.password;
            delete user._id;
            res.json({'sucess': user});
            return
        } else {
            res.json(false);
            return
        }
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
        return
    }

});

app.get('/updateprofile', async (req, res) => {
    console.log('updateprofile');

    let data = JSON.parse(req.headers.data);
    let Olduser = data.user;
    let Newuser = data.newuser;
    let Newpokfav = data.pokefav;
    let genre = data.genre;

    try {
        let userExist = await collectionUser.findOne({user: Olduser});

        if (userExist){
            await collectionUser.updateOne({user: Olduser}, {$set: {user: Newuser, pokefav: Newpokfav, genre: genre}});
            let user = await collectionUser.findOne({user: Newuser});
            delete user.password;
            delete user._id;
            res.json({'sucess': user});
            return
        } else {
            res.json(false);
            return
        }
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
        return
    }
});

app.get('/rooms', (req, res) => {
    res.json(rooms);
    return
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    socket.broadcast.emit('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
    });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        msg = censorBadWords(msg);
        socket.broadcast.emit('message', msg);
    });
    
    socket.on('room', (room, msg) => {
        console.table(room);
        console.log(msg);
        //io.to(room).emit('message', msg);
        socket.join(room);
        rooms.push(room);
        socket.emit('all rooms', rooms);
    });


    socket.on('join', (room) => {
        console.log('join room: ' + room);
        socket.join(room);
        io.to(room).emit('join', room);
        //check the number of user in the room, if 2 remove the room from the list
        console.log(io.sockets.adapter.rooms.get(room).size)
        if (io.sockets.adapter.rooms.get(room).size == 2){
            console.log('2 users in the room');

            io.to(room).emit('getAdversary')
            socket.on('sendAdversary', (adversary) => {
                console.log('suis la');
                console.log(adversary);
                socket.broadcast.emit('returnAdversary', adversary);
            });
        }
        socket.on('fix', (player, trainer) => {
            console.log('fix');
            console.log(player);
            console.log(trainer);
            io.to(room).emit('fixed', player, trainer);
        });
    });

    

    socket.on('leave', (room) => {
        console.log('leave room: ' + room);
        socket.leave(room);
        io.to(room).emit('leave', room);
    });

})


server.listen(PORT, () => {
    console.log('Server ip : http://' +ip.address() +":" + PORT);
})
