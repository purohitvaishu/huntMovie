import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import sgMail from "@sendgrid/mail";

import app from "../app";
import shareMovie from "../controllers/shareMovie";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
let mongoServer;
let mail;

describe("POST /users/movies/share", () => {
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

  beforeEach(() => {
    mail = sinon.mock(sgMail);
    mail.expects("setApiKey").once();
    mail.expects("send").once();
  });

  it("Sharing movie once", async () => {
    const req = {
      body: {
        id: "21456",
        db: "upcoming",
        title: "jumanji",
        emailId: "john@gmail.com"
      },
      params: {}
    };

    const res = {
      send: () => {}
    };

    let spy = (res.send = sinon.spy());

    await shareMovie(req, res, () => {});
    mail.verify();
    spy.should.have.been.calledOnce;
  });
});
