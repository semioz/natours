import redis from "redis";
import mongoose from "mongoose";
const redisUrl = process.env.REDIS
const redisClient = redis.createClient(redisUrl);

client.on("connect", () => console.log("Redis Connection Is Successful!"));
client.on("err", (err) => console.log("Redis Client Error:", err));
await client.connect();

//Patching the mongoose's exec, to actually make our caching reusable
const exec = mongoose.Query.prototype.exec;

//Toggleable Caching Solution
//Use it wherever you want by adding ".cache()" in the end!
mongoose.Query.prototype.cache = async function() {
    this.useCache = true;
    return this;
}

//---------
mongoose.Query.prototype.exec = async function() {
    //Check, if we want to implement the caching by using ".cache()"
    if (!this.useCache) return exec.apply(this, arguments);
    //Redis key
    const key = Object.assign({}, this.getQuery, { collection: this.mongooseCollection.name })
    const cacheValue = await redisClient.get(key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) ? doc.map(d => new this.model(doc)) : new this.model(doc);
    }
    const finale = await exec.apply(this, arguments);
    redisClient.set(key, JSON.stringify(finale), "EX", 10);
    return finale;
}