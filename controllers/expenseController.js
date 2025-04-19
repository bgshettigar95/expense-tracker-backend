const Expense = require('../models/Expense');
const User = require('../models/User');
const xlsx = require('xlsx');

//Add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { category, icon, amount, date } = req.body;

        if (!category || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();

        res.status(200).json({ newExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

//Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Get all Expense
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json({ expenses });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

//Download Expense excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const espenses = await Expense.find({ userId }).sort({ date: -1 });

        //Prepare data for Excel
        const data = espenses.map((expense) => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws);
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download('expense_details.xlsx');
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
