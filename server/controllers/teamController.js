const Team = require('../models/Team');

// In-memory team list for demo
let teams = [
  new Team(1, 'Design Team', ['Lora Piterson', 'Alice Smith'], 'Lora Piterson', 'Active'),
  new Team(2, 'Dev Team', ['Bob Johnson', 'Carol Lee'], 'Bob Johnson', 'Active'),
  new Team(3, 'QA Team', ['Carol Lee'], 'Carol Lee', 'Inactive'),
];

exports.list = (req, res) => {
  res.json({ status: 'success', data: teams });
};

exports.create = (req, res) => {
  const { name, members, lead, status } = req.body;
  const id = teams.length ? teams[teams.length - 1].id + 1 : 1;
  const team = new Team(id, name, members, lead, status);
  teams.push(team);
  res.json({ status: 'success', data: team });
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  const team = teams.find(t => t.id === id);
  if (!team) return res.status(404).json({ status: 'error', message: 'Team not found' });
  const { name, members, lead, status } = req.body;
  if (name) team.name = name;
  if (members) team.members = members;
  if (lead) team.lead = lead;
  if (status) team.status = status;
  res.json({ status: 'success', data: team });
};

exports.delete = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = teams.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ status: 'error', message: 'Team not found' });
  teams.splice(idx, 1);
  res.json({ status: 'success' });
}; 