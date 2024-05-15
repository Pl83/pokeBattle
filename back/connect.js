const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
    "mongodb+srv://test:1234@cluster0.dya1mju.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('user');

        // Query for a movie that has the title 'Back to the Future'
        const col = db.collection("user");

        const ok = await database.collection('profile').find({}).toArray();

        console.log(ok);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }


}
run().catch(console.dir);