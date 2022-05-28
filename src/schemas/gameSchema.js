import Joi from "joi";

const gameSchema = Joi.object({
    name: Joi.not(null).required(),
    image: Joi
        .string()
        .not(null)
        .pattern(/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/)
        .required(),
    stockTotal: Joi.number().greater(0).required(),
    pricePerDay: Joi.number().greater(0).required()
});

export default gameSchema;