const { HttpError, ctrlWrapper } = require("../helpers");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.SERVER,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const manufactures = async (req, res) => {
  const connection = await pool.getConnection();
  const data = await connection.query(`SELECT id, description name 
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
    `SELECT id, description name, constructioninterval
    FROM models
    WHERE canbedisplayed = 'True'
    AND manufacturerid = ${id}
    ORDER BY description`
  );
  res.json(data);
};

const type = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  const data = await connection.query(
    `SELECT id, description name, a.displaytitle ,  a.displayvalue
    FROM passanger_cars pc 
    JOIN passanger_car_attributes a on pc.id = a.passangercarid
    WHERE canbedisplayed = 'True'
    AND modelid = ${id} AND ispassengercar = 'True'`
  );

 const acc = new Map();

 data
    .map(({ id, name, displaytitle, displayvalue }) => {
      const container = {};
      container["id"] = id;
      container["name"] = name;
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
  const data = await connection.query(
    `SELECT DISTINCT a.OENbr AS oem, m.description AS brand, i.NormalizedDescription AS description FROM article_oe a 
    JOIN manufacturers m ON m.id=a.manufacturerId 
    JOIN articles i ON i.DataSupplierArticleNumber=a.datasupplierarticlenumber
    WHERE a.OENbr='${query}'`
  );

  let unic = data.reduce((accumulator, currentValue) => {
    if (accumulator.every(item => !(item.oem === currentValue.oem && item.brand === currentValue.brand && item.description !== currentValue.description)))
     accumulator.push(currentValue);
    return accumulator;
  }, []);
  
  console.log(unic)
  res.json(data);
};

module.exports = {
  manufactures: ctrlWrapper(manufactures),
  models: ctrlWrapper(models),
  type: ctrlWrapper(type),
  search: ctrlWrapper(search),
};
