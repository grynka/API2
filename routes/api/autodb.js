const express = require("express");
const autobdOperations = require("../../controllers/autodb");
const router = express.Router();

router.get("/manufactures", autobdOperations.manufactures);

router.get("/models/:id", autobdOperations.models);

router.get("/type/:id", autobdOperations.type);

router.get("/search/:query", autobdOperations.search);

router.get("/trees/:car_id/:cat_id", autobdOperations.trees);

module.exports = router;
