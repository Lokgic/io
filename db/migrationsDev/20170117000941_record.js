exports.up = (knex, Promise) => {
  return knex.schema.createTable('record', (table) => {
    table.string('uid').notNullable();
    table.string('module').notNullable();
    table.string('chapter').notNullable();
    table.string('section').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.primary(['uid', 'module','chapter','section'])

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('record');
};
