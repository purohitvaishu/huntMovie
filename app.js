import "@babel/polyfill";
import "@babel/register";
import { json } from "body-parser";
import connectMongo from "connect-mongo";
import cookieParser from "cookie-parser";
import { connect, connection } from "mongoose";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import flash from "connect-flash";
import { join } from "path";
import passport from "passport";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import winston from "winston";

import authPassport from "./auth/passport";
import taskUpcoming from "./controllers/scheduleUpcoming";
import taskTrending from "./controllers/scheduleTrending";
import indexRoute from "./routes/index";

const MongoStore = connectMongo(session);
dotenv.config();
authPassport(passport);

const app = express();
app.set("view engine", "ejs");

let swaggerDocument = yaml.safeLoad(fs.readFileSync('./swagger/swaggerFile.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(join(__dirname, "public")));

app.use(json());
app.use(urlencoded({ extended: true }));

const db = process.env.mongo_uri;
if (process.env.NODE_ENV === "development") {
  connect(
    db,
    { useNewUrlParser: true }
  )
    .then(() => {
      console.log("MongoDB Connected");
      const PORT = process.env.PORT || 80;
      app.listen(PORT, () =>
        console.log(`server has been created on port ${PORT}`)
      );
    })
    .catch(err => winston.error(`${err.status || 500} - ${err.message}`));
}
taskUpcoming.start();

taskTrending.start();

app.use(cookieParser());

app.use(
  session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: connection,
      ttl: process.env.expiry
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(indexRoute);

app.use((err, req, res, next) => {
  if (err) {
    winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      }`
    );
    return res.status(err.status || 500).send("An error occured");
  }
  next();
});

app.use((req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404", { url: req.url });
  }
});

export default app;
