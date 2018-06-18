'use strict'
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    github_project: DataTypes.STRING,
    system: DataTypes.STRING,
    event: DataTypes.STRING,
    source: DataTypes.STRING,
    actor: DataTypes.STRING
  }, {})

  Event.associate = function (models) {
    // associations can be defined here
  }

  Event.event_types = {
    new_repo_created: 'new_repo_created',
    fyi_requested_via_github: 'fyi_requested_via_github',
    fyi_requested_via_jira: 'fyi_requested_via_jira'
  }

  Object.freeze(Event.event_types)

  return Event
}
