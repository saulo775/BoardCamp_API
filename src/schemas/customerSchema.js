import Joi from "joi";

const customerSchema = Joi.object({
    name: Joi.string().min(4).max(30).required(),
    phone: Joi.string().min(10).max(11).pattern(/^[0-9]/).required(),
    cpf:  Joi.string().length(11).pattern(/^[0-9]/).required(),
    birthday: Joi.date().required()
})

export default customerSchema;