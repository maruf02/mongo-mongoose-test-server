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


















// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------

// mongooseOperation/mongoose.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
// app.use(cookieParser());

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofnl5ln.mongodb.net/mongoMongooseTest?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongooseDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongooseDB connection error: ${err}`);
});

const RoomCategorySchema = new mongoose.Schema({
    BrandName: { type: String, required: true },
    BrandImage: { type: String, required: true },

});

const RoomCategoryModel = mongoose.model('Room_Category_mongoose', RoomCategorySchema);

// All Room Category section
app.get('/mongooseRoomCategory', async (req, res) => {
    try {
        const result = await RoomCategoryModel.find();
        // console.log(result);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/mongooseRoomCategory/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const result = await RoomCategoryModel.findById(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/mongooseRoomCategory', async (req, res) => {
    try {
        const { BrandName, BrandImage } = req.body;
        const newRoomCategory = { BrandName, BrandImage };
        // console.log('mongoose', newRoomCategory);
        const result = await RoomCategoryModel.create(newRoomCategory);
        console.log(result);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.put('/mongooseRoomCategory/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateBrand = req.body;
        const result = await RoomCategoryModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    BrandName: updateBrand.BrandName,
                    BrandImage: updateBrand.BrandImage
                }
            },
            { new: true } // { new: true } returns the modified document
        );
        console.log(result);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }

})


app.delete('/mongooseRoomCategory/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await RoomCategoryModel.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoints for other operations (update, delete, etc.) can be added similarly

app.get('/', (req, res) => {
    // res.send('Mongoose server is running');
    res.send(`Mongoose server is running and mongodb server is running in port: ${port}`);
});

// app.listen(port, () => {
//     console.log(`Mongoose server is running in port: 5001`);
// });

module.exports = app;
