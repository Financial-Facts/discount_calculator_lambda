import Joi from 'joi';

const create = Joi.object({
    
    cik: Joi.string().required(),

    symbol: Joi.string().required(),

    name: Joi.string().required(),

    ratioPrice: Joi.number().optional(),

    lastUpdated: Joi.forbidden(),

    ttmPriceData: Joi.array().required(),

    tfyPriceData: Joi.array().required(),

    ttyPriceData: Joi.array().required(),

    quarterlyBVPS: Joi.array().required(),

    quarterlyPE: Joi.array().required(),

    quarterlyEPS: Joi.array().required(),

    quarterlyROIC: Joi.array().required()

});

const update = create;

export default { create, update };