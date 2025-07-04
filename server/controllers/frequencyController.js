const Frequency = require('../models/Frequency');

exports.list = async (req, res) => {
  try {
    const frequencies = await Frequency.all();
    res.json({ status: 'success', data: frequencies });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const frequency = await Frequency.create({ name, description });
    res.json({ status: 'success', data: frequency });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const frequency = await Frequency.update(id, { name, description });
    res.json({ status: 'success', data: frequency });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Frequency.delete(id);
    res.json({ status: 'success', message: 'Frequency deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 