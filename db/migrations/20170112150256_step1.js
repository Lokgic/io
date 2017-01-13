

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('students', function(table){
      table.string('password').notNullable();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('students', function(table){
      table.dropColumn('password');
    })
  ])
};
