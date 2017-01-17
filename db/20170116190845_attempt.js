exports.up = (knex, Promise) => {
  return knex.schema.createTable('attempt', (table) => {
    table.increments('aid',1);
    table.string('sid').notNullable();
    table.string('pid').notNullable();
    table.string('type');
    table.string('input');
    table.boolean('correct');
    table.timestamp('createdAt').defaultTo(knex.fn.now());

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('attempt');
};
