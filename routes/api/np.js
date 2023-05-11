const express = require("express");
const np = require("../../controllers/np");
const router = express.Router();

router.post("/city", np.cities);

module.exports = router;
