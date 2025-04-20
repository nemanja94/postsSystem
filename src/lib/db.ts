import "server-only";
import {MongoClient, ServerApiVersion} from "mongodb";

if (!process.env.DB_URI) {
    throw new Error("DB_URI is not defined");
}

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function getDb(dbName: string) {
    try {
        await client.connect();
        console.log("Connected to db");
        return client.db(dbName);
    } catch (err) {
        console.log(err);
    }
}

export default async function getCollection(collectionName: string) {
    const db = await getDb("test");

    if (db) return db.collection(collectionName);
    return null;
}