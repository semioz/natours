const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB Connection Is Successful");
}).catch(err => {
    console.log(err)
})

const tourSchema = new mongoose.Schema({
    "name": { type: String, required: [true, "A tour must have a name."], unique: true },
    "rating": { type: Number, default: 0 },
    "price": { type: Number, required: [true, "A tour must have a price."] }
});

const Tour = mongoose.model("Tour", tourSchema);

const app = require('./app');
const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}...`);
});