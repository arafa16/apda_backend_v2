const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");
const express_fileupload = require("express-fileupload");

const db = require("./src/models/index.js");
const errorHandlerMiddleware = require("./src/middleware/error_handler.js");
const not_found = require("./src/middleware/not_found.js");

const auth_router = require("./src/routes/auth.route.js");
const status_router = require("./src/routes/status.route.js");
const company_router = require("./src/routes/company.route.js");

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

app.use("/api/v1/auth", auth_router);
app.use("/api/v1/status", status_router);
app.use("/api/v1/company", company_router);

app.use(errorHandlerMiddleware);
app.use(not_found);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
