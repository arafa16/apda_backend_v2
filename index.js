const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");

const db = require("./src/models/index.js");

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db.sequelize,
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
      expires: 1000 * 60 * 60 * process.env.SESS_EXPIRES,
    },
  }),
);

app.use(
  cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND],
  }),
);

app.use(express.json());
app.use(express_fileupload());
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
