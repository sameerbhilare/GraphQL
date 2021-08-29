const db = require('./db');

const Query = {
  // graphql will return only requested fields, we don't have to do anything special for that.
  jobs: () => db.jobs.list(),
};

const Job = {
  // each resolver function receives some arguments - the 1st argument is the parent object
  company: (job) => db.companies.get(job.companyId), // 'job' obj returned fromDB has 'companyId' field (refer jobs.json)
};

module.exports = { Query, Job };
