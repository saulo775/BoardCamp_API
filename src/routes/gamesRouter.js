import { Router } from "express";
import { getGames, postNewGame } from "../controllers/gamesController.js";


const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", postNewGame);

export default gamesRouter;