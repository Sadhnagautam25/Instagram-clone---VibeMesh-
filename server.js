require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// server ko DB se connect krna h using connectToDB Func. call krke
connectToDB();

app.listen(3000, () => {
  console.log("server is running on port:3000 ✅"); // server is start now
});


