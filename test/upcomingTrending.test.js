import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';
import trendingList from '../controllers/trendingMovies';
import upcomingList from '../controllers/upcomingMovies';
import trendingMovieInfo from '../controllers/trendingMovieInfo';
import upcomingMovieInfo from '../controllers/upcomingMovieInfo';
import trendingModel from '../models/trending';
import upcomingModel from '../models/upcoming';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
let mongoServer;

describe('upcoming trending controllers', () => {
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
    const data = new upcomingModel({
      title: 'hello',
      overview: 'hey',
      id: 1,
      languages: 'en',
      release_date: Date.now(),
      poster_path: '/sadasdasdas'
    })
    await data.save();
  })

  before(async () => {
    const data = new trendingModel({
      title: 'hello',
      overview: 'hey',
      id: 1,
      languages: 'en',
      release_date: Date.now(),
      poster_path: '/sadasdasdas'
    })
    await data.save();
  })

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it(' upcoming movies info res.render should be called once', async () => {
    const req = {
      params: {info: '1-asdas'}
    }
    const res = {
      render: () => {}
    };
    let spy = res.render = sinon.spy()
    await upcomingMovieInfo(req, res, () => {});
    spy.should.have.been.calledOnce
  });

  it(' upcoming movies res.render should be called once', async () => {
    const req = {
      params: {}
    };
    const res = {
      render: () => {}
    };
    let spy = (res.render = sinon.spy());
    await upcomingList(req, res, () => {});
    spy.should.have.been.calledOnce;
  });

  it(' trending movies info res.render should be called once', async () => {
    const req = {
      params: {info: '1-asdas'}
    }
    const res = {
      render: () => {}
    };
    let spy = res.render = sinon.spy()
    await trendingMovieInfo(req, res, () => {});
    spy.should.have.been.calledOnce
  });

  it(' trending movies res.render should be called once', async () => {
    const req = {
      params: {}
    }
    const res = {
      render: () => {}
    };
    let spy = res.render = sinon.spy()
    await trendingList(req, res, () => {});
    spy.should.have.been.calledOnce
  });

  //   it('trendingMovies returns 200 status', (done) => {
  //     value.then(() => {
  //       const number = 1;
  //       chai.request(app)
  //       .get('/movies/trending/' + number)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       })
  //     });
  //   })

  //   it('trendingMovieInfo returns 200 status', (done) => {
  //     value.then(() => {
  //       const info = "299534-trending-Avengers:%20Endgame";
  //       chai.request(app)
  //       .get('/movies/trending/info/' + info)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       })
  //     });
  //   })
  //   it('upcomingMovieInfo returns 200 status', (done) => {
  //     value.then(() => {
  //       const info = "454640-upcoming-The%20Angry%20Birds%20Movie%202";
  //       chai.request(app)
  //       .get('/movies/upcoming/info/' + info)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       })
  //     });
  //   });
});
