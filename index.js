//import required modules
const express = require("express")
const path = require("path")
const { MongoClient, ObjectId } = require("mongodb");


//Mongo config stuff
const dbUrl = "mongodb://127.0.0.1:27017";
const client = new MongoClient(dbUrl);


//set up express app and port number
const app = express();
const port = process.env.port || 8888

//SET UP TEMPLATE ENIGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//SET UP STATIC file
app.use(express.static(path.join(__dirname, "public")));


//SET UP SERVER LISTENING
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

//convert form data to JSON for easier use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//PAGE ROUTES
app.get("/", async (request, response) => {
    links = await getLinks();
    response.render("index", { title: "BookStore", menu: links });
});

app.get("/books", async (request, response) => {
    links = await getLinks();
    response.render("books", { title: "Books", menu: links });
});

app.get("/order", async (request, response) => {
    editLinkData = await getSingleLink(request.query.linkId);
    console.log(editLinkData)

    response.render("order", { title: "Checkout", order: editLinkData});
});


//MONGO FUNCTIONS
/* Function to connect to DB and return the "football" database. */
async function connection() {
    await client.connect();
    db = client.db("appdb");
    return db;
}

/* Function to select all documents from football. */
async function getLinks() {
    db = await connection();
    var results = db.collection("books").find({});
    res = await results.toArray(); //convert to an array
    return res;
}

async function getSingleLink(id) {
    db = await connection();
    const editIdFilter = { _id: new ObjectId(id) };
    const result = db.collection("books").findOne(editIdFilter);
    console.log(result)

    return result;
}
