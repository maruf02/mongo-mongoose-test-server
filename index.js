const express = require('express');
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const mongooseApp = require('./MongooseOperation/mongoose');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        // 'https://hotelbooking-client.web.app',
        // 'https://hotelbooking-client.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/mongoose', mongooseApp);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofnl5ln.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const AllRoomCategoryCollection = client.db('mongoMongooseTest').collection('Room_Category_mongo');

        // All Create api works here
        // auth related api





        // All Room Category section
        app.get('/mongoRoomCategory', async (req, res) => {
            const cursor = AllRoomCategoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/mongoRoomCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AllRoomCategoryCollection.findOne(query);
            res.send(result);
        })

        app.post('/mongoRoomCategory', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await AllRoomCategoryCollection.insertOne(newBrand);
            res.send(result);
        })

        app.put('/mongoRoomCategory/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateBrand = req.body;
            const Brand = {
                $set: {
                    BrandName: updateBrand.BrandName,
                    BrandImage: updateBrand.BrandImage
                }
            }

            const result = await AllRoomCategoryCollection.updateOne(filter, Brand, option);
            res.send(result);
        })

        app.delete('/mongoRoomCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await AllRoomCategoryCollection.deleteOne(query);
            res.send(result);
        })





        // All Room Category section



        // All Room Category section
        // For my cart


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




// Start main Server
app.get('/', (req, res) => {
    // res.send('server is running');
    res.send(`mongodb server is running and mongodb server is running in port: ${port}`);
    // res.send(`mongodb server is running in port: ${port}`);
});

app.listen(port, () => {
    console.log(`mongodb server is running in port: ${port}`);
})













