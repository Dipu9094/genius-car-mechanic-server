const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId=require('mongodb').ObjectId
require("dotenv").config();

const app = express();
let cors = require("cors");
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fs9pd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("car-mechanic");
        const servicesCollection = database.collection("services");
        // get api
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // Get single service 
        app.get("/services/:id", async (req, res) => {
            const id=req.params.id 
            const query={_id:ObjectId(id)}
            const service=await servicesCollection.findOne(query)
            res.json(service)

        });


        // POST api
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log("added user", result);
            res.json(result);
        });
        // Delete api
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);

            console.log("delete id no is", result);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("my first ever node ");
});
app.listen(port, () => {
    console.log("Listening from ", port);
});
