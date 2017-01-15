exports.up = (knex, Promise) => {
  return knex.schema.createTable('problem', (table) => {
    table.increments(pid,1).unique();
    table.string('type').notNullable();
    table.string('question').notNullable();
    table.string('answer').notNullable();
    table.string('options');
    table.integer('module');
    table.integer('chapter');
    table.integer('section');

  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('problem');
};
