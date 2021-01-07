import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from '../app';
import movies from '../models/movies';
import movieList from '../controllers/moviesList';
import movieInfo from '../controllers/movieInfo';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
let mongoServer;

describe('movies controllers', () => {
  before((done) => {
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
    const data = new movies({
      title: "hello",
      overview: "hey",
      id: 1,
      release_date: Date.now(),
      poster_path: "/sadasdasdas"
    });
    await data.save();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('moviesList res.render should be called Once', (done) => {
    const req = {
      body: {},
      params: {}
    };
    const res = {
      render: () => {}
    };
    let spy = (res.render = sinon.spy());
    movieList(req, res, () => {}).then(() => {
      spy.should.have.been.calledOnce;
      done();
    });
  });

  it('moviesInfo res.render should be called Once', async () => {
    const req = {
      body: {},
      params:{info:`1-sdas`}
    };
    const res = {
      render:() => {}
    };
    let spy = res.render = sinon.spy();
    await movieInfo(req,res, () => {});
    spy.should.have.been.calledOnce
  });

//   it('movieList returns 200 status', (done) => {
//     value.then(() => {
//       const number = 1;
//       chai
//         .request(app)
//         .get('/movies/' + number)
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     });
//   })
});
