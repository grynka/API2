const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape

const typeSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      unique: true,
    },
    constructioninterval: {
      type: String,
    }
  },
  { versionKey: false }
);

const Type = model("passanger_car", typeSchema);

module.exports = { Type };
