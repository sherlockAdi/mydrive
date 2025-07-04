const Category = require('../models/Category');

exports.list = async (req, res) => {
  try {
    const categories = await Category.all();
    res.json({ status: 'success', data: categories });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.json({ status: 'success', data: category });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.update(id, { name, description });
    res.json({ status: 'success', data: category });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.json({ status: 'success', message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 