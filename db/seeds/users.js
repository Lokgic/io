bcrypt = require('bcrypt')

var hash = bcrypt.hashSync("password", 10);

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('students').del()
  .then(() => {
    return Promise.all([
      // Inserts seed entries
      knex('students').insert({
        username: 'michael',
        email: 'michael@mherman.org',
        realName:'wat',
        password:bcrypt.hashSync("abc", 10)
      }),
      knex('students').insert({
        username: 'michaeltwo',
        email: 'michael@realpython.org',
        realName:'ok',
        password: bcrypt.hashSync("cde", 10)
      })
    ]);
  });
};
