const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path=require('path')

const app = express();
const port = 3000; // Change this to your desired port number

app.use(express.static(__dirname))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Main_Screen.html'))
})

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ParkHere_Parking_Space_Data';

// Collection Name
const collectionName = 'Parking_Data';

// Create a new MongoClient
const client = new MongoClient('mongodb://localhost:27017');

async function findData() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to server');

        // Connect to the database
        const db = client.db(dbName);

        // Get the collection
        const collection = db.collection(collectionName);

        // Query for documents where Parking_Lot is "0"
        const id = "0";
        const query = { Parking_Lot: "0" };
        const cursor = await collection.findOne(query);
        console.log(cursor.park_data);
        const last_data = cursor.park_data;
        console.log(last_data);
        let getStatus = "";
        for (let key in last_data) {
            if (last_data.hasOwnProperty(key)) {
                getStatus = last_data[key];
            }
        }

        return getStatus;

    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error to handle it outside
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

app.get('/api/getParkingStatus', async (req, res) => {
    try {
        const status = await findData();
        res.json({ park_status: status });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
