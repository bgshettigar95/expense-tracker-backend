const Income = require('../models/Income');
const User = require('../models/User');
const xlsx = require('xlsx');

//Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const { source, icon, amount, date } = req.body;

        if (!source || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();

        res.status(200).json({ newIncome });
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

//Delete Income
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Get all income
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json({ incomes });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

//Download income excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomeSources = await Income.find({ userId }).sort({ date: -1 });

        //Prepare data for Excel
        const data = incomeSources.map((income) => ({
            Source: income.source,
            Amount: income.amount,
            Date: income.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws);
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download('income_details.xlsx');
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
