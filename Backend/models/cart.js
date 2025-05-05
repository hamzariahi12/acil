const mongoose = require('mongoose');
const { restaurants } = require('../../frontend/src/services/api');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true },
    restaurant:{type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" , required: true },
});
module.exports = mongoose.model('Cart', cartSchema);
