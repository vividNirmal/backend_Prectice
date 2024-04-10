const { Schema, default: mongoose } = require("mongoose");

const productSchema =new Schema({
    name:{
        type:String,
        require:true
    },
    price:"String",
    des : "String",
    category: "String",
    img:{
        type:Object
    }
})

module.exports = mongoose.model("Product", productSchema);