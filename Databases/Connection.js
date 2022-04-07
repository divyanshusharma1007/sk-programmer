const mongoose = require('mongoose')
const connectToMongo = () => {
     mongoose.connect("mongodb://localhost:27017/sk-programmer", () => { console.log("connection is successfull") })
}
module.exports = connectToMongo;