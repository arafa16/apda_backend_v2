const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");
const express_fileupload = require("express-fileupload");

const db = require("./src/models/index.js");
const errorHandlerMiddleware = require("./src/middleware/error_handler.js");
const not_found = require("./src/middleware/not_found.js");

const application_router = require("./src/routes/application.route.js");
const auth_router = require("./src/routes/auth.route.js");
const status_router = require("./src/routes/status.route.js");
const company_router = require("./src/routes/company.route.js");
const bank_router = require("./src/routes/bank.route.js");
const privilege_router = require("./src/routes/privilege.route.js");
const user_router = require("./src/routes/user.route.js");
const nominal_select_router = require("./src/routes/nominal_select.route.js");
const stage_router = require("./src/routes/stage.route.js");
const investment_scheme_router = require("./src/routes/investment_scheme.route.js");
const investment_partisipant_router = require("./src/routes/investment_partisipant.route.js");
const investment_account_router = require("./src/routes/investment_account.route.js");

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

app.use("/api/v1/application", application_router);
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/status", status_router);
app.use("/api/v1/company", company_router);
app.use("/api/v1/bank", bank_router);
app.use("/api/v1/privilege", privilege_router);
app.use("/api/v1/user", user_router);
app.use("/api/v1/nominal_select", nominal_select_router);
app.use("/api/v1/stage", stage_router);
app.use("/api/v1/investment_scheme", investment_scheme_router);
app.use("/api/v1/investment_participant", investment_partisipant_router);
app.use("/api/v1/investment_account", investment_account_router);

app.use(errorHandlerMiddleware);
app.use(not_found);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
