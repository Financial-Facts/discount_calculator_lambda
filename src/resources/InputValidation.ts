import Joi from 'joi';

const create_discount = Joi.object({
    
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

const update_discount = create_discount;

const check_for_discounts = Joi.object({

    cikList: Joi.array().required()

});

export default { create_discount, update_discount, check_for_discounts };