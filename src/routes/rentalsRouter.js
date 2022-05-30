import { Router } from "express";

import {
    createNewRental,
    getRentals,
    terminateRent,
    deleteRent
} from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", createNewRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", terminateRent);
rentalsRouter.delete("/rentals/:id", deleteRent);


export default rentalsRouter;