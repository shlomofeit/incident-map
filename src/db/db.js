import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "incident-map";

let db = null;
let client = null;

async function connect() {
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB...");
  return db;
}

export async function getDb() {
  if (db) return db;
  await connect();
  return db;
}
