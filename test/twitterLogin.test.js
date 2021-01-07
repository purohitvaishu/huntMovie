import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import passport from "passport";

import twitterLogin from "../auth/twitterAuth";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let mongoServer, auth;

describe("GET /auth/twitter", () => {
  before(done => {
    mongoServer = new MongoMemoryServer();
    mongoServer
      .getConnectionString()
      .then(mongoUri => {
        return mongoose.connect(mongoUri, { useNewUrlParser: true }, err => {
          if (err) done(err);
        });
      })
      .then(() => done());
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(done => {
    auth = sinon
      .stub(passport, "authenticate")
      .returns((_req, res, next) => next());
    done();
  });

  afterEach(() => {
    auth.restore();
  });

  it("should login by twitter", done => {
    twitterLogin.authenticate(() => {
      return true;
    });

    twitterLogin.callback(auth);
    done();
  });
});
