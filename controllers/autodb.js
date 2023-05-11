const { HttpError, ctrlWrapper } = require("../helpers");
const mariadb = require("mariadb");
const { Brand } = require("../models/manufacture");
const { Model } = require("../models/model");
const { Type } = require("../models/type");
const { Tree } = require("../models/trees");

const pool = mariadb.createPool({
  host: process.env.SERVER,
  user: process.env.USER,
  port: process.env.PORT,
  database: process.env.DATABASE,
  connectionLimit: 100,
});


const addSeller = async (req, res) => {
  
  const connection = await pool.getConnection();
  const { name, uid } = req.body;
  await connection.query(
    `INSERT INTO seller (name, uid)
VALUES('${name}', ${uid})`
  );
  res.sendStatus(200);
};


const manufactures = async (req, res) => {
  const connection = await pool.getConnection();
  const data = await connection.query(`SELECT id, description 
    FROM manufacturers
    WHERE canbedisplayed = 'True' 
    AND ispassengercar = 'True' 
    AND iscommercialvehicle = 'False' 
    ORDER BY description`);
  res.json(data);
};

const models = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  const data = await connection.query(
    `SELECT id, description , constructioninterval
    FROM models
    WHERE canbedisplayed = 'True'
    AND manufacturerid = ${id}
    ORDER BY description`
  );
  res.json(data);
};

const types = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  const data = await connection.query(
    `SELECT id, description, a.displaytitle ,  a.displayvalue
    FROM passanger_cars pc 
    JOIN passanger_car_attributes a on pc.id = a.passangercarid
    WHERE canbedisplayed = 'True'
    AND modelid = ${id} AND ispassengercar = 'True'`
  );

  const acc = new Map();

  data
    .map(({ id, description, displaytitle, displayvalue }) => {
      const container = {};
      container["id"] = id;
      container["description"] = description;
      container["options"] = [{ [displaytitle]: displayvalue }];
      return container;
    })
    .forEach((elem) => {
      if (acc.get(elem.id) === undefined) {
        acc.set(elem.id, elem);
      }
      const { options } = acc.get(elem.id);
      options.push(elem.options.pop());
    });

  res.json(Array.from(acc.values()));
};

const search = async (req, res) => {
  const { query } = req.params;
  const connection = await pool.getConnection();
  let data = await connection.query(
    `SELECT DISTINCT a.OENbr AS oem, m.description AS brand, i.NormalizedDescription AS description FROM article_oe a 
    JOIN manufacturers m ON m.id=a.manufacturerId 
    JOIN articles i ON i.DataSupplierArticleNumber=a.datasupplierarticlenumber
    WHERE a.OENbr='${query}'`
  );

  if (data.length === 0) {
    data =
      await connection.query(`SELECT DISTINCT c.PartsDataSupplierArticleNumber AS oem, s.description AS brand, i.NormalizedDescription AS description FROM article_cross c
    JOIN suppliers s ON s.id=c.SupplierId
    JOIN article_oe a ON a.OENbr=c.OENbr
    JOIN articles i ON i.DataSupplierArticleNumber=a.datasupplierarticlenumber
    WHERE c.PartsDataSupplierArticleNumber='${query}'`);
  }

  let unic = data.reduce((accumulator, currentValue) => {
    if (
      accumulator.every(
        (item) =>
          !(
            item.oem === currentValue.oem &&
            item.brand === currentValue.brand &&
            item.description !== currentValue.description
          )
      )
    )
      accumulator.push(currentValue);
    return accumulator;
  }, []);

  res.json(unic);
};

const trees = async (req, res) => {
  const { car_id, cat_id } = req.params;
  const connection = await pool.getConnection();
  const data = await connection.query(
    `SELECT id, description, 
    IF(EXISTS(SELECT * FROM passanger_car_trees t1 
    INNER JOIN passanger_car_trees t2 ON t1.parentid=t2.id WHERE t2.parentid="${car_id}" AND t1.passangercarid="${cat_id}" LIMIT 1), 1, 0) AS havechild 
    FROM passanger_car_trees WHERE passangercarid="${car_id}" AND parentId="${cat_id}"
    ORDER BY havechild`
  );
  res.json(data);
};

const brands = async (req, res, next) => {
  try {
    const brand = await Brand.find()
      .where({ ispassengercar: "True" })
      .where({ iscommercialvehicle: "False" })
      .where({ isengine: "False" });
    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
};

const model = async (req, res, next) => {
  const { id } = req.params;
  try {
    const model = await Model.find().where({ manufacturerid: id });
    res.status(200).json(model);
  } catch (error) {
    next(error);
  }
};

const type = async (req, res, next) => {
  const { id } = req.params;
  try {
    const type = await Type.aggregate([
      { $match: { modelid: id, canbedisplayed: "True" } },
      {
        $lookup: {
          from: "passanger_car_attributes",
          localField: "id",
          foreignField: "passangercarid",
          as: "attributes",
        },
      },
      {
        $project: {
          id: 1,
          name: "$description",
          displaytitle: "$attributes.displaytitle",
          displayvalue: "$attributes.displayvalue",
        },
      },
    ]);

    const types = type.map(({ id, name, displaytitle, displayvalue }) => {
      const container = {};
      container["id"] = id;
      container["description"] = name;
      let result = [];
      for (let i = 0; i < displaytitle.length; i++) {
        result.push({ [displaytitle[i]]: displayvalue[i] });
        container["options"] = result;
      }
      return container;
    });

    res.status(200).json(types);
  } catch (error) {
    next(error);
  }
};

const tree =  async (req, res, next) => {
    const { car_id } = req.params;
    const { cat_id } = req.params;

    try {
const trees = await Tree.find({passangercarid: Number(car_id), parentid: Number(cat_id)})
console.log(trees)
res.status(200).json(trees)
}
catch {
throw err;
}
}

module.exports = {
  manufactures: ctrlWrapper(manufactures),
  models: ctrlWrapper(models),
  types: ctrlWrapper(types),
  trees: ctrlWrapper(trees),
  search: ctrlWrapper(search),
  tree: ctrlWrapper(tree),
  brands: ctrlWrapper(brands),
  model: ctrlWrapper(model),
  type: ctrlWrapper(type),
  addSeller: ctrlWrapper(addSeller),
};
