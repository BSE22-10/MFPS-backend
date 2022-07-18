import Joi from "joi";

exports.vehicle = Joi.object().keys({
  number_plate: Joi.string().min(3).max(40).required(),
  arrival_time: Joi.date().integer().min(16),
});
