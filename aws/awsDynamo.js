const { v4: uuidv4 } = require("uuid");
const express = require("express");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
// process.env.AWS_ACCESS_KEY_ID;
// process.env.AWS_SECRET_ACCESS_KEY;
process.env.AWS_DEFAULT_REGION;

// ap-northeast-1

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);
const routes = express.Router();
//get all item
routes.get("/", async (req, res) => {
  const prams = {
    TableName: "product",
  };
  try {
    const comand = new ScanCommand(prams);
    const response = await docClient.send(comand);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

//post api item / create item
routes.post("/", async (req, res) => {
  const item = {
    _id: uuidv4(),
    ...req.body,
  };

  const prams = {
    TableName: "product",
    Item: item,
  };
  try {
    const comand = new PutCommand(prams);
    const response = await docClient.send(comand);
    res.send({ response: response, item: item });
  } catch (err) {
    console.log(err);
  }
});

// get by id
routes.get("/get-item/:primaryKey", async (req, res) => {
  const params = {
    TableName: "product",
    Key: {
      _id: req.params.primaryKey,
    },
  };

  try {
    const command = new GetCommand(params);
    const result = await docClient.send(command);
    res
      .status(200)
      .json({ message: "Item retrieved successfully", item: result.Item });
  } catch (error) {
    console.error("Error retrieving item:", error);
    res.status(500).json({ error: "Failed to retrieve item" });
  }
});

//update api
routes.put("/:primaryKey", async (req, res) => {
  const AttributeToUpdate = req.body;

  let updateExpression = "set";
  const expressionAttributevalues = {};

  Object.keys(AttributeToUpdate).forEach((key, index) => {
    updateExpression += `#attrName${index} = :attrValue${index}`;
    if (index < Object.keys(AttributeToUpdate).length - 1) {
      updateExpression += ",";
    }
    expressionAttributevalues[`:attrValue${index}`] = AttributeToUpdate[key];
  });

  const expressionAttributeNames = {};
  Object.keys(AttributeToUpdate).forEach((key, index) => {
    expressionAttributeNames[`#attrName${index}`] = key;
  });
  // console.log(expressionAttributevalues,updateExpression, expressionAttributeNames);
  // return;
  const prams = {
    TableName: "product",
    Key: {
      _id: req.params.primaryKey,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributevalues,
  };
  try {
    const comand = new UpdateCommand(prams);
    const response = await docClient.send(comand);
    res.send({ response: response });
  } catch (err) {
    console.log(err);
  }
});

routes.delete("/:primaryKey", async (req, res) => {
  const prams = {
    TableName: "product",
    Key: {
      _id: req.params.primaryKey,
    },
  };
  try {
    const comand = new DeleteCommand(prams);
    const response = await docClient.send(comand);
    res.send({ response: response });
  } catch (err) {
    console.log(err);
  }
});
module.exports = routes;
