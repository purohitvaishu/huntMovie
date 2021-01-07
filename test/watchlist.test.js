import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";

import watchlist from "../controllers/watchlistList";
import addWatchlist from "../controllers/watchlist";
import countNotification from "../services/countNotification";
import userModel from "../models/users";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

describe("watchlist controller", () => {
  let userId;
  let count;
  let mongoServer;
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

  before(async () => {
    const user = new userModel({
      fullname: "hey",
      emailId: "hey@hey.com",
      dob: Date.now(),
      password: "asdasdadsads"
    });
    const userData = await user.save();
    userId = userData._id;
  });

  beforeEach(() => {
    count = sinon.stub(countNotification, "arguments");
    count.withArgs(1).returns(0);
  });

  afterEach(() => {
    count.restore();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("watchlist res.render should be called once", async () => {
    const req = {
      params: {},
      user: { _id: userId }
    };
    const res = {
      render: () => {}
    };
    let spy = (res.render = sinon.spy());
    await watchlist(req, res, () => {});
    spy.should.have.been.calledOnce;
  });

  it("add to watchlist res.send should be called once", async () => {
    const req = {
      params: {},
      user: { _id: userId },
      body: {
        watchlistStatus: "Add to watchlist",
        movie_id: 1,
        db: "movie"
      }
    };
    const res = {
      send: () => {}
    };
    let spy = (res.send = sinon.spy());
    await addWatchlist(req, res);
    spy.should.have.been.calledOnce;
  });
  //   after(async () => {
  //     await watchlistModel.findOneAndDelete({watchlist_movie_id: 8844});
  //   })

  //   it('watchlistList returns 200 status', (done) => {
  //     value.then(() => {
  //       const number = 1;
  //       chai.request(app)
  //       .get('/users/movies/watchlist/' + number)
  //       .set('Cookie', 'connect.sid = s%3AkIB0XuFAbUsi-dgsqyB9kVHPHD2zR21t.CIyZEnB6q1dT1L%2BmSkDRLHKWHuzig06Ycp%2BbljZmlfU')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       })
  //     });
  //   })

  //   it('watchlist returns 200 status', (done) => {
  //     value.then(() => {
  //       const movie_id = 8844;
  //       const db = 'movie';
  //       const watchlistStatus = 'Add to watchlist';
  //       chai.request(app)
  //       .post('/users/movies/watchlist/')
  //       .set('Cookie', 'connect.sid = s%3AkIB0XuFAbUsi-dgsqyB9kVHPHD2zR21t.CIyZEnB6q1dT1L%2BmSkDRLHKWHuzig06Ycp%2BbljZmlfU')
  //       .send({movie_id, db, watchlistStatus })
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       })
  //     });
  //   });
});
