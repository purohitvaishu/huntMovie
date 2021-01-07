import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from 'sinon';
import nock from 'nock';

import countNotification from '../services/countNotification';
import notificationModel from '../models/notifications';
import userModel from '../models/users';
import * as tokenModule from '../services/tokens';
import castUpcomingTrending from '../services/castUpcomingTrending';

const should = chai.should();
chai.use(chaiHttp);
let mongoServer;

describe('Services', () => {
  let userId;
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
      fullname: 'hey',
      emailId: 'hey@hey.com',
      dob: Date.now(),
      password: 'asdasdadsads'
    });
    const userData = await user.save();
    userId = userData._id;

    const notification = new notificationModel({
      friend_emailId: null,
      user_id: userId,
      message: 'Using mocking',
      read_notification: false
    });
    await notification.save();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should display number of notifications', async () => {
    const count = await countNotification(userId);
    count.should.be.a('Number');
    count.should.equal(1);
  });

  it('should return tokens', async () => {
    const stub = sinon.stub(tokenModule, 'authorize');
    stub.withArgs(1, 'asdasdasd').returns([]);
    const arr = await tokenModule.tokens(1);
    arr.should.be.a('Array');
    stub.restore();
  });

  it('casUpcomingTrending should return object', async () => {
    const scope = nock('https://api.themoviedb.org/3/movie')
      .get('/1/credits')
      .query({api_key: process.env.tmdb_key})
      .reply(200, {
        cast: {}
      });
      const data = await castUpcomingTrending(1);
      data.should.be.a('object');
  });

  // it('Should fetch cast of movies', (done) => {
  //   value.then(async () => {
  //     const id = 499701;
  //     const cast = await castUpcomingTrending(id);
  //     cast.should.be.a('Array');
  //     done();
  //   });
  // });

  // it('Should return tokens', (done) => {
  //   value.then(async () => {
  //     const id = '5d356486eb95c0420cf8f9ee';
  //     const cast = await tokens(id);
  //     cast.should.be.a('Array');
  //     done();
  //   });
  // });
});
