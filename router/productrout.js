const express = require("express");
const multer = require("multer");
const product = require("../db/product");
const { geturlofImge } = require("../firebase/uplodimg");
const routes = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// get all products
routes.get("/", async (req, res) => {
  res.send(await product.find({}));
});

// get by page
routes.get("/pagi/", async (req, res) => {
  //pagination
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let startindex = (page - 1) * limit;
  const results = {};
  results.next = {
    page: page + 1,
    limit: limit,
  };
  results.previos = {
    page: page - 1,
    limit: limit,
  };
  results.results = await product.find({}).limit(limit).skip(startindex);
  res.send(results);
});
//search product
routes.get("/search/:key", async (req, res) => {
  let key = req.params.key;
  let data = await product.find({
    $or: [
      { name: { $regex: key } },
      { price: { $regex: key } },
      { des: { $regex: key } },
      { category: { $regex: key } },
    ],
  });
  res.send(data);
});

routes.post("/add", upload.single("file"), async (req, res) => {
  console.log(req.file);
  let { name, price, des, category } = req.body;
  const url = await geturlofImge(req.file);
  console.log(url);
  const products = new product({
    name,
    price,
    des,
    category,
    img: url,
  });
  await products.save();
  res.status(200).json("product is upload succussfull");
});
// get only one product
routes.get("/:id", async (req, res) => {
  let id = req.params.id;
  // // const objectId = new
  // console.log(objectId);
  let getproduct = await product.findById(id);
  if (getproduct) {
    res.send(getproduct);
  } else {
    res.send("product not availble");
  }
});
// delete products
routes.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let getproduct = await product.findByIdAndDelete(id);
  res.send(getproduct);
});
// update product
routes.put("/:id", async (req, res) => {
  let id = req.params.id;
  let { name, price, des, category } = req.body;
  let updateproduct = await product.findByIdAndUpdate(id, {
    name,
    price,
    des,
    category,
  });
  res.send(updateproduct);
});

module.exports = routes;
