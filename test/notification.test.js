import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';
import notifications from '../controllers/notification';
import userModel from '../models/users';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
let mongoServer;

describe('Notification controller', () => {
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

  before( async () => {
    const user = new userModel({
      fullname: 'hey',
      emailId: 'hey@hey.com',
      dob: Date.now(),
      password: 'asdasdadsads'
    })
    const userData = await user.save();
    userId = userData._id
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('notifications res.render should be called', async () => {
    const req = {
      params: {},
      user:{_id: userId}
    }
    const res = {
      render: () => {}
    };
    let spy = res.render = sinon.spy()
    await notifications(req, res, () => {});
    spy.should.have.been.calledOnce
  });
});
