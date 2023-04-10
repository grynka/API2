const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape

const modelSchema = new Schema(
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

const Model = model("model", modelSchema);

module.exports = { Model };
