const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape

const manufactureSchema = new Schema(
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
    img: {
      type: String,
      default: "no image",
    },
  },
  { versionKey: false }
);

const Brand = model("manufacture", manufactureSchema);

module.exports = { Brand };
