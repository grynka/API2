const { HttpError, ctrlWrapper } = require("../helpers");
const axios = require("axios");


const cities = async (req, res) => {
    const { city } = req.body;

    const requestBody = {
      apiKey: process.env.NP_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
      //  Page: "1",
        FindByString: city,
    //    Limit: "20000",
      },
    };
    
    try {
         const response = await axios.post(
           "https://api.novaposhta.ua/v2.0/json/",
           requestBody
         );
    res.json(response.data);
  } catch (err) {
    return err.response;
  }
};

module.exports = {
  cities: ctrlWrapper(cities),
};