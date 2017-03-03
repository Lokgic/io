
exports.up = function(knex, Promise) {
  return knex.schema.createTable('modelstat', (table) => {
    table.increments('msid',1);
    table.integer('uid');
    table.integer('udSize');
    table.integer('constants');
    table.integer('extensionMean');
    table.integer('onePlace');
    table.integer('twoPlace');
    table.integer('threePlace');
    table.integer('identity');
    table.integer('conditional');
    table.integer('conjunction');
    table.integer('disjunction');
    table.integer('biconditional');
    table.integer('negation');
    table.integer('universal');
    table.integer('existential');
    table.integer('depth');
    table.integer('correct');
    table.integer('incorrect');
    table.string('note');
    table.timestamp('createdAt').defaultTo(knex.fn.now());

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modelstat');
};
