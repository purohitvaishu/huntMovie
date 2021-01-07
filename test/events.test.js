import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { google } from 'googleapis';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import createEvent from '../services/createEvent';
import deleteEvent from '../services/deleteEvent';
import * as tokenModule from '../services/tokens';
import upcomingModel from '../models/upcoming';
import eventModule from '../controllers/event';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let mongoServer;

describe('Events', () => {
  let event;
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

  beforeEach(() => {
    event = sinon.mock(google);
    event.expects('calendar').once().returns({
      events:{
        insert: async () => {
          return {data:{id:1}}
        },
        delete: async () => {}
      }
    });
  });

  
  it('delete event should returns object', async ()=> {
    await deleteEvent({},{});
    event.verify();
  });

  it('create event should returns object', async ()=> {
    const data = await createEvent({},{});
    event.verify();
    data.should.equal(1);
  });

  it('event for follow should call res.send once', async ()=> {
    const req = {
      user: {
        _id:1
      },
      body: {
        isFollowed: 'Follow',
        movieId: 1
      }
    }
    const res = {
      send: () => {}
    }
    
    const spy = (res.send = sinon.spy());
    const stub = sinon.stub(tokenModule, 'tokens');
    stub.withArgs(1).returns(['event', {}])
    await eventModule(req, res);
    event.verify();
    spy.should.have.been.calledOnce;
    stub.restore();
  });

  it('event for unfollow should call res.send once', async ()=> {
    const req = {
      user: {
        _id:1
      },
      body: {
        isFollowed: 'unFollow',
        movieId: 1
      }
    }
    const res = {
      send: () => {}
    }
    const spy = (res.send = sinon.spy());
    const stub = sinon.stub(tokenModule, 'tokens');
    stub.withArgs(1).returns(['event', {}])
    await eventModule(req, res);
    event.verify();
    spy.should.have.been.calledOnce;
    stub.restore();
  });

});
