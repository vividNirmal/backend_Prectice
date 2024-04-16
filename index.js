const express = require("express");
const cors = require("cors");
const product = require("./router/productrout");
const awsdynamoDb = require('./aws/awsDynamo');
require("./db/config");
const app = express();
app.use(cors());
  

app.use(express.json());
app.use("/product", product);
app.use('/awsproduct',awsdynamoDb)
app.use("*", (req,res) => {
  res.status(404).send({
    message : " Page not found"
  })
});

app.use((req, res, next) => {
  res.status(400).send("page not found");
});
app.listen(800, () => {
  console.clear()
  console.log("server live");
});
