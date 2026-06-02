const express = require("express");
const dotenv = require("dotenv");

const db = require("./src/models/index.js");

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND],
  }),
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
