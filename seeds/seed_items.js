exports.seed = function(knex) {
  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' }
      ]);
    });
};
