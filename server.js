const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connection Is Successful");
}).catch(err => {
    console.log("Can't establish connection to MongoDB")
    console.log(err)
})

const app = require('./app');
const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}...`);
});