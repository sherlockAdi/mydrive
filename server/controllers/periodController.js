const Period = require('../models/Period');

exports.list = async (req, res) => {
  try {
    const periods = await Period.all();
    res.json({ status: 'success', data: periods });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { label, startDate, endDate, categoryId } = req.body;
    const period = await Period.create({ label, startDate, endDate, categoryId });
    res.json({ status: 'success', data: period });
  } catch (err) {
    if (err.message && err.message.includes('startDate and endDate must be in yyyy-MM-dd format')) {
      res.status(400).json({
        status: 'error',
        message: err.message,
        received: {
          startDate: req.body.startDate,
          endDate: req.body.endDate
        }
      });
    } else {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, startDate, endDate, categoryId } = req.body;
    const period = await Period.update(id, { label, startDate, endDate, categoryId });
    res.json({ status: 'success', data: period });
  } catch (err) {
    if (err.message && err.message.includes('startDate and endDate must be in yyyy-MM-dd format')) {
      res.status(400).json({
        status: 'error',
        message: err.message,
        received: {
          startDate: req.body.startDate,
          endDate: req.body.endDate
        }
      });
    } else {
      res.status(500).json({ status: 'error', message: err.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Period.delete(id);
    res.json({ status: 'success', message: 'Period deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}; 