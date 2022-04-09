const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ConnectToServer = require('./Databases/Connection');

ConnectToServer();
app.use(express.json())

app.use("/api/auth", require("./Routes/BlogersAuth"))

app.listen(port, () => { console.log(`sk-programmerBackend is listning at ${port}`) })