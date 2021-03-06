'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TiersSchema extends Schema {
  up () {
    this.create('tiers', (table) => {
      table.increments();

      table.integer('level').unsigned().nullable();
      table.string('name').nullable();
      table.string('start_time').nullable();
      table.string('end_time').nullable();
      table.string('currency').nullable();
      table.decimal('max_buy', 40, 18).nullable().defaultTo(0);
      table.decimal('min_buy', 40, 18).nullable().defaultTo(0);
      table.integer('campaign_id').unsigned().nullable();

      table.timestamps()
    })
  }

  down () {
    this.drop('tiers')
  }
}

module.exports = TiersSchema
