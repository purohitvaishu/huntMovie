import { Router } from "express";

import upcoming from "../controllers/upcomingMovies";
import trending from "../controllers/trendingMovies";
import moviesList from "../controllers/moviesList";
import readMore from "../controllers/readMore";
import upcomingMovieInfo from "../controllers/upcomingMovieInfo";
import trendingMovieInfo from "../controllers/trendingMovieInfo";

const router = Router();

router.get("/list/", moviesList);

router.get("/upcoming/", upcoming);

router.get("/trending/", trending);

router.get("/info/", readMore);

router.get("/upcoming/info/", upcomingMovieInfo);

router.get("/trending/info/", trendingMovieInfo);

export default router;
