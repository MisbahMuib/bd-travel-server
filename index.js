const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gncei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		console.log("connect to database");
		const database = client.db("bdTravel");
		const servicesCollection = database.collection("services");

		//initialization
		app.get("/", (req, res) => {
			res.send("Travel BD");
		});

		//GET API
		app.get("/services", async (req, res) => {
			const cursor = servicesCollection.find({});
			const services = await cursor.toArray();
			res.send(services);
		});

		//get single service
		app.get("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await servicesCollection.findOne(query);
			res.send(service);
		});

		// POST API
		app.post("/services", async (req, res) => {
			const service = req.body;
			console.log("hit the post api", service);

			const result = await servicesCollection.insertOne(service);
			console.log(result);
			res.json(result);
		});

		// DELETE API
		app.delete("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await servicesCollection.deleteOne(query);

			console.log("deletting user with id ", result);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.listen(port, () => {
	console.log("port running ", port);
});
