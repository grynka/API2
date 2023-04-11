const express = require("express");
const autobdOperations = require("../../controllers/autodb");
const router = express.Router();

router.get("/type/:id", autobdOperations.type);

router.get("/search/:query", autobdOperations.search);

router.get("/trees/:car_id/:cat_id", autobdOperations.trees);

router.get("/brands", autobdOperations.brands);

router.get("/model/:id", autobdOperations.model);

module.exports = router;
