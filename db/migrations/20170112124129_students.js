exports.up = (knex, Promise) => {
  return knex.schema.createTable('students', (table) => {
    table.increments();
    table.string('username').unique().notNullable();
    table.timestamp('realName').notNullable();
    table.string('email').unique().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
