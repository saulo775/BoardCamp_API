import { Router } from "express";
import { 
    getCustomers, 
    getCustomerById,
    postNewCustomer,
    updateCustomer
} from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", postNewCustomer);
customersRouter.put("/customers/:id", updateCustomer);


export default customersRouter;