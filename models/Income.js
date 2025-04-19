const mongoose = require('mongoose');

const IncomeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, require: true },
    date: { type: Date, default: Date.now }
},
    { timestamps: true });

module.exports = mongoose.model("Income", IncomeSchema);