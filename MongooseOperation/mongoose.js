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
    res.send(`Mongoose server is running `);
});

// app.listen(port, () => {
//     console.log(`Mongoose server is running in port: 5001`);
// });

module.exports = app;
