const {MongoClient} = require("mongodb");
// const uri = "mongodb+srv://khesehang81:evilking123@cluster0.fdjc1fh.mongodb.net/sbsDB?retryWrites=true&w=majority";
require("dotenv").config();
const uri = process.env.DB_URL;
const client = new MongoClient(uri);

const sbsDB = client.db("sbsDB");
module.exports = sbsDB;

