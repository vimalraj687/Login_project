const mongoose = require("mongoose");

// const MONGODB_URL =
//   process.env.MONGODB_URL || "mongodb://localhost:27017/PwCrudvv";
const databaseconnect = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) =>
      console.log(`connected to database ${conn.connection.host}`)
    )
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};
module.exports = databaseconnect;
