const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username : {
        type : string,
        required : true
    },
    email : {
        type : string,
        required : true
    },
    password : {
        type : string,
        required : true
    },
    questionsUploaded : [{
        type : mongoose.Types.ObjectId,
        ref : "Question",
        required : false
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;

