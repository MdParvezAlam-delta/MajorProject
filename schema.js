// // listing.js contains schema for mongoose 
// // schema .js contains schema for serverside -validation

const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),

    // -------------------- filterization code --------------------
    // validating multiple categories array
    categories: Joi.array().items(Joi.string()).min(1).required(),
    // ------------------------------------------------------------

    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().greater(0).required(),
    image:Joi.string().allow('', null)
  }).required(),
});

const reviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),

  }).required()

})

module.exports = {
  listingSchema,
  reviewSchema,
};