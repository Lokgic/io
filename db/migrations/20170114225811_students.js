exports.up = (knex, Promise) => {
  return knex.schema.createTable('students', (table) => {
    table.increments();
    table.string('sid').unique().notNullable();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').unique().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
