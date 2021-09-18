
const mongoose = require('mongoose');

let url = "mongodb+srv://faiz:sami@cluster0.0ypmv.mongodb.net/user?retryWrites=true&w=majority";
 mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology:true
 }).then(() => {
     console.log("Connected");
 }).catch(e => {
    console.log("fail");
 });


