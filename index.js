const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ConnectToServer = require('./Databases/Connection');

ConnectToServer();
app.use(express.json())

app.use("/api/auth/bloger", require("./Routes/BlogersAuth"))
app.use("/api/auth/user", require("./Routes/UserAuth"))

app.listen(port, () => { console.log(`sk-programmerBackend is listning at ${port}`) })