import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri ="mongodb+srv://admin:LehoPiMBzUP7rnkd@pokebattle.1lrolqw.mongodb.net/?retryWrites=true&w=majority&appName=pokebattle";

const client = new MongoClient(uri);

const collectionUser = client.db("pokebattle").collection("user");

async function run() {

    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

}

run().catch(console.dir);

export {client, collectionUser};