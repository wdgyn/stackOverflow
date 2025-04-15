import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri);
const dbName = process.env.DATABASE_NAME;

let db;

export async function initDBIfNecessary() {
    if(!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

//OR
//The above approach is apparently better
/*
export async function initDBIfNecessary() {
    if (!db) {
        //only connect to the database if we are not already connected
        client = await MongoClient.connect("mongodb://localhost:27017");
        db = client.db("is3106_Assignment1");
    }
    return db;
}
*/


export async function disconnect() {
    if (db) {
        await db.close();
        db= null;
    }
}


