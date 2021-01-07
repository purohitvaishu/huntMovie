import { Router } from "express";

import home from "../controllers/home";
import moviesRoute from "./movies";
import usersRoute from "./users";
import authRoute from "./auth";

const router = Router();

router.get("/", home);

router.use("/movies", moviesRoute);
router.use("/users", usersRoute);
router.use("/auth", authRoute);

export default router;
