exports.up = (knex, Promise) => {
  return knex.schema.createTable('problem', (table) => {
    table.string("pid").notNullable();
    table.string('type').notNullable();
    table.string('question').notNullable();
    table.string('answer').notNullable();
    table.string('options');
    table.string('module');
    table.string('chapter');
    table.string('section');
    table.primary('pid','type')

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('problem');
};
