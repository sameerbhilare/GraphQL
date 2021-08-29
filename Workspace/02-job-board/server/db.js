const { DataStore } = require('notarealdb'); // package for sample DB

const store = new DataStore('./data'); // base folder

module.exports = {
  // companies will be loaded from .data/companies.json,
  // then you can execute typical operations on these. e.g. list, insert, delete, udpate, etc.
  companies: store.collection('companies'),

  // jobs will be loaded from .data/jobs.json
  // then you can execute typical operations on these. e.g. list, insert, delete, udpate, etc.
  jobs: store.collection('jobs'),

  // users will be loaded from .data/users.json
  // then you can execute typical operations on these. e.g. list, insert, delete, udpate, etc.
  users: store.collection('users'),
};
