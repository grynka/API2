const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape

const treeSchema = new Schema(
  {
    id: {
      type: Number,
      required: [true, "ID is required"],
      unique: true,
    },
  },
  { versionKey: false }
);

const Tree = model("passanger_car_tree", treeSchema);

module.exports = { Tree };