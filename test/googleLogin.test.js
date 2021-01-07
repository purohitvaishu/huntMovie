import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import passport from "passport";

import googleLogin from "../auth/googleAuth";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let mongoServer, auth;

describe("GET /auth/google", () => {
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

  it("should login by google", done => {
    googleLogin.authenticate(() => {
      return true;
    });

    googleLogin.callback(auth);
    done();
  });
});
