const db = require('./db');
const Query = {
  // graphql will return only requested fields, we don't have to do anything special for that.
  jobs: () => db.jobs.list(),
};

module.exports = { Query };
