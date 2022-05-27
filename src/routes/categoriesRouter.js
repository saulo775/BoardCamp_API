import { Router } from "express";
import { 
    getCategories, 
    postCategorie 
} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", postCategorie);

export default categoriesRouter;