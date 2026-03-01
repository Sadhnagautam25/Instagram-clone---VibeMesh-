const monggose = require("mongoose");

async function connectToDB() {
  await monggose.connect(process.env.MONGO_URI);

  console.log("server is connect to DB successfully.🎉");
}

module.exports = connectToDB;