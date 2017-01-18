exports.up = (knex, Promise) => {
  return knex.schema.createTable('leader', (table) => {
    table.increments('lid');
    table.integer('uid').notNullable();;
    table.string('logicise').notNullable();
    table.integer('score').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());


  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('leader');
};
