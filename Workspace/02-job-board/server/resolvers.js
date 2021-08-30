const db = require('./db');

const Query = {
  // return single company for given id
  // each resolver function receives some arguments
  // - the 1st argument is the parent object, 2nd arg is argument object received for this query
  company: (root, { id }) => db.companies.get(id),

  // return single job for given id
  // each resolver function receives some arguments
  // - the 1st argument is the parent object, 2nd arg is argument object received for this query
  job: (root, { id }) => db.jobs.get(id),

  // graphql will return only requested fields, we don't have to do anything special for that.
  jobs: () => db.jobs.list(),
};

const Mutation = {
  // the 1st argument is the parent object, 2nd arg is params object passed
  createJob: (root, { input }) => {
    const id = db.jobs.create(input);
    return db.jobs.get(id);
  },
};

const Job = {
  // each resolver function receives some arguments - the 1st argument is the parent object
  company: (job) => db.companies.get(job.companyId), // 'job' obj returned fromDB has 'companyId' field (refer jobs.json)
};

const Company = {
  // each resolver function receives some arguments - the 1st argument is the parent object
  jobs: (company) => db.jobs.list().filter((job) => job.companyId === company.id),
};

module.exports = { Query, Job, Company, Mutation };
