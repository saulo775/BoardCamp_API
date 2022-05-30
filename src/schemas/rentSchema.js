import Joi from "joi";

const rentSchema = Joi.object({
    customerId: Joi.number().not(null).required(),
    gameId: Joi.number().not(null).required(),
    daysRented: Joi.number().greater(0).not(null).required()
});

export default rentSchema;