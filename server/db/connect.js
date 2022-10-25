import {MongoClient, ServerApiVersion} from 'mongodb'
import ENV from "../core/HandleEnv.js";

const uri = ENV.MONGODB_URI
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
const Database = {
    connect: async () => {
        await client.connect()
    },
    close: async () => {
        await client.close()
        return true
    },
    getDb: (DbName) => {
        return client.db(DbName)
    },
    getCollection: (collectionName) => {
        return client.db('VOTEDBs').collection(collectionName)
    },
    getAllDocs: async (collectionName, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.find({}).toArray().then((docs) => {
            return docs
        })
    },
    InsertOne: async (collectionName, doc, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.insertOne(doc).then((result) => {
            return result
        })
    },
    insertMany: async (collectionName, docs, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.insertMany(docs).then((result) => {
            return result
        })
    },
    DeleteOne: async (collectionName, doc, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.deleteOne(doc).then((result) => {
            return result
        })
    },
    deleteMany: async (collectionName, docs, Dbname = 'VOTEDBs') => {

        const collection = client.db(Dbname).collection(collectionName)
        return await collection.deleteMany(docs).then((result) => {
            return result
        })
    },
    UpdateOne: async (collectionName, filter, update, flag, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.updateOne(filter, update).then((result) => {
            return result
        })
    },
    updateMany: async (collectionName, filter, update, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.updateMany(filter, update).then((result) => {
            return result
        })
    },
    findMany: async (collectionName, filter, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.find(filter).toArray().then((result) => {
            return result
        })
    },
    findById: async (collectionName, id, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.findOne({_id: id}).then((result) => {
            return result
        })
    },
    findOne: async (collectionName, filter, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.findOne(filter).then((result) => {
            return result
        })
    },


    findOneAndUpdate: async (collectionName, filter, update, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.findOneAndUpdate(filter, update).then((result) => {
            return result
        })
    },
    find: async (collectionName, filter, Dbname = 'VOTEDBs') => {
        const collection = client.db(Dbname).collection(collectionName)
        return await collection.find(filter).toArray().then((result) => {
            return result
        })
    }
}
Database.connect().then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log(err)
})

const VoteDb = Database.getDb("VOTEDBs")
const UsersCollection = VoteDb.collection("users")


export {Database, VoteDb, UsersCollection, client}
