bcrypt = require('bcrypt')

var hash = bcrypt.hashSync("password", 10);

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('student').del()
  .then(() => {
    return Promise.all([
      // Inserts seed entries
      knex('student').insert({
        nickname: 'test',
        email: 'test@test.com',
        name:'test',
        password:bcrypt.hashSync("test", 10)
      }),
      knex('student').insert({
        nickname: 'm2',
        email: 'michael@realpython.org',
        name:'ok',
        password: bcrypt.hashSync("cde", 10)
      })
    ]);
  });
};
