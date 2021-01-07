import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import user from "../models/users";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let mongoServer;

describe("POST /auth/login", () => {
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

  beforeEach(async () => {
    let User = new user({
      emailId: "tester@gmail.com",
      password: "tester@123",
      fullname: "unit tester",
      dob: "2000-03-04"
    });
    await User.save();
  });

  afterEach(async () => {
    await user.deleteOne({ emailId: "tester@gmail.com" });
  });

  it("should logged in user", done => {
    user.findOne({ emailId: "tester@gmail.com" }, (err, account) => {
      account.emailId.should.eql("tester@gmail.com");
      done();
    });
  });

  it("should enter correct credentials", done => {
    user.findOne({ emailId: "tester" }, (err, account) => {
      if (err) done();
      done();
    });
  });
});
