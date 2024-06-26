const app = require("./app");
const dotenv = require('dotenv')
const databaseConnection = require("./db");

dotenv.config({path: "./.env"});

databaseConnection();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server is up at port ${port}`);
});