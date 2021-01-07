import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../app";
import register from "../controllers/register";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let mongoServer;

describe("POST /auth/register", () => {
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

  it("should create newuser", done => {
    const req = {
      body: {
        emailId: "john@gmail.com",
        password: "test@123",
        fullname: "John Doe",
        dob: "2000-03-04",
        cpass: "test@123"
      },
      params: {}
    };

    const res = {
      render: () => {}
    };

    let spy = (res.render = sinon.spy());

    register(req, res, () => {}).then(() => {
      spy.should.have.been.calledOnce;
      done();
    });
  });

  it("should required all fields so newuser not created", done => {
    const req = {
      body: {
        password: "test@123",
        fullname: "John Doe",
        dob: "2000-03-04",
        cpass: "test@123"
      },
      params: {}
    };

    const res = {
      render: () => {}
    };

    let spy = (res.render = sinon.spy());

    register(req, res, () => {}).then(() => {
      spy.should.have.been.calledOnce;
      done();
    });
  });

  it("should match pattern so newuser not created", done => {
    const req = {
      body: {
        emailId: "test.com",
        password: "test",
        fullname: "John Doe",
        dob: "2000-03-04",
        cpass: "test@123"
      },
      params: {}
    };

    const res = {
      render: () => {}
    };

    let spy = (res.render = sinon.spy());

    register(req, res, () => {}).then(() => {
      spy.should.have.been.calledOnce;
      done();
    });
  });
});
