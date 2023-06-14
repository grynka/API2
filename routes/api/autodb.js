const express = require("express");
const autobdOperations = require("../../controllers/autodb");
const router = express.Router();

router.get("/manufactures", autobdOperations.manufactures);

router.get("/models/:id", autobdOperations.models)

router.get("/types/:id", autobdOperations.types);

router.get("/type/:id", autobdOperations.type);

router.get("/trees/:car_id/:cat_id", autobdOperations.trees);

router.get("/search/:query", autobdOperations.search);

router.get("/tree/:car_id/:cat_id", autobdOperations.tree);

router.get("/brands", autobdOperations.brands);

router.get("/model/:id", autobdOperations.model);

router.post("/addseller", autobdOperations.addSeller);

router.post("/register", autobdOperations.register);


module.exports = router;
