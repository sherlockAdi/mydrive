const SubType = require('../models/SubType');

exports.list = async (req, res) => {
  try {
    const subtypes = await SubType.all();
    res.json({ status: 'success', data: subtypes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    const subtype = await SubType.create({ name, description, categoryId });
    res.json({ status: 'success', data: subtype });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;
    const subtype = await SubType.update(id, { name, description, categoryId });
    res.json({ status: 'success', data: subtype });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await SubType.delete(id);
    res.json({ status: 'success', message: 'SubType deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 