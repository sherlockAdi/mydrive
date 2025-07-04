class Team {
  constructor(id, name, members = [], lead = '', status = 'Active') {
    this.id = id;
    this.name = name;
    this.members = members;
    this.lead = lead;
    this.status = status;
  }
}

module.exports = Team; 