const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require("./app");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connection Is Successful");
}).catch(err => {
    console.log("Can't establish connection to MongoDB")
    console.log(err)
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

//deneme