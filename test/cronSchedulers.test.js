import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import nock from "nock";

import trendingSchedule from "../controllers/scheduleTrending";

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

describe("Schedulers", () => {
  it("TrendingScheduler should make fake api call", done => {
    nock("https://api.themoviedb.org/3/trending")
      .get("/movie/week")
      .query({ api_key: process.env.tmdb_key })
      .reply(200, {
        results: []
      });

    trendingSchedule.start();

    if (trendingSchedule.start()) {
      trendingSchedule.stop();
      done();
    }
  });
});
