const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const router = express.Router();

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);

app.listen(PORT, () => {
  console.log(`Port started on ${PORT}`);
});
