const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var ObjectId = require("mongodb").ObjectId;

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
var database;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS API Project Using MongoDB",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000/",
      },
    ],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *      summary: Checking if get method working or not
 *      description: Cheking Purpose
 *      responses:
 *        2013:
 *              description: get method is working
 *
 */

// DEFAULT PAGE
app.get("/", (request, response) => {
  response.send(
    '<h1><a href="http://localhost:4000/products"/>Products</h1><br><h1><a href="http://localhost:4000/documentation"/>Documentation</h1>'
  );
});

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type : object
 *              properties:
 *                  product:
 *                      type: string
 *                  price:
 *                      type: integer
 */

/**
 * @swagger
 * /products:
 *  get:
 *      summary: Getting all the products
 *      description: Get all the products listed down
 *      responses:
 *        2013:
 *              description: Fetch the data from MongoDB
 *              content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#components/schemas/Product'
 */

// GET ALL THE PRODUCTS
app.get("/products", (request, response) => {
  database
    .collection("products")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

/**
 * @swagger
 * /products/{product}:
 *  get:
 *      summary: Getting product by product name
 *      description: Get the product by writing down the name of it
 *      parameters:
 *          - in: path
 *            name : product
 *            required: true
 *            description: Product name required
 *            schema:
 *              type: string
 *      responses:
 *        2013:
 *              description: Fetch the data from MongoDB
 *              content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#components/schemas/Product'
 */

// GET PRODUCTS BY PRODUCT NAME
app.get("/products/:product", (request, response) => {
  database
    .collection("products")
    .find({ product: request.params.product })
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

/**
 * @swagger
 * /products_id/{_id}:
 *  get:
 *      summary: Getting product by product id
 *      description: Get the product by writing down the id of it
 *      parameters:
 *          - in: path
 *            name : _id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: string
 *      responses:
 *        2013:
 *              description: Fetch the data from MongoDB
 *              content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/Product'
 *
 */

// GET PRODUCTS BY PRODUCT ID
app.get("/products_id/:_id", async (request, response) => {
  database
    .collection("products")
    .find({ _id: ObjectId(request.params._id) })
    .toArray((err, result) => {
      console.log(result);
      if (err) throw err;
      response.send(result);
    });
});

/**
 * @swagger
 * /products/addproduct:
 *  post:
 *      summary: Adding new products
 *      description: Add new product in the MongoDB database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Product"
 *      responses:
 *        2013:
 *              description: Added Successfully!
 */

// ADD/CREATE NEW PRODUCTS
app.post("/products/addproduct", (request, response) => {
  let data = {
    product: request.body.product,
    price: request.body.price,
  };
  database.collection("products").insertOne(data, (err, result) => {
    if (err) throw err;
    response.send(data);
  });
});

/**
 * @swagger
 * /products/{_id}:
 *  put:
 *      summary: Updating current products
 *      description: Updating the product in the MongoDB database
 *      parameters:
 *          - in: path
 *            name : _id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Product"
 *      responses:
 *        2013:
 *              description: Updated Successfully!
 *              content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/Product'
 */

// UPDATE THE PRODUCT
app.put("/products/:_id", (request, response) => {
  let query = { _id: ObjectId(request.params._id) };
  let data = {
    product: request.body.product,
    price: request.body.price,
  };
  let dataset = {
    $set: data,
  };
  database.collection("products").updateOne(query, dataset, (err, result) => {
    if (err) throw err;
    response.send(data);
  });
});

/**
 * @swagger
 * /products/{_id}:
 *  delete:
 *      summary: Deleting current products
 *      description: Deleting the product in the MongoDB database
 *      parameters:
 *          - in: path
 *            name : _id
 *            required: true
 *            description: ID required
 *            schema:
 *              type: string
 *      responses:
 *        2013:
 *              description: Deleted Successfully!
 */

// DELETE THE PRODUCT
app.delete("/products/:_id", (request, response) => {
  let query = { _id: ObjectId(request.params._id) };
  database.collection("products").deleteOne(query, (err, result) => {
    if (err) throw err;
    response.send("Delete Successfully!");
  });
});

app.listen(process.env.PORT, () => {
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, result) => {
      if (err) throw err;
      database = result.db(process.env.DB_NAME);
    }
  );
});
