require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  dbuser: process.env.DBUSER,
  dbpass: process.env.DBPASS,
  dbname: process.env.DBNAME,
  jwt_secret: process.env.JWT_SECRET,
};
