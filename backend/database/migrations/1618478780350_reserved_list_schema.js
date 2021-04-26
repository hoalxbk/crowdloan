'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReservedListSchema extends Schema {
  up () {
    this.create('reserved_list', (table) => {
      table.increments();
      table.string('email', 255).notNullable();
      table.string('wallet_address', 255).notNullable();
      table.string('start_time').nullable();
      table.string('end_time').nullable();
      table.string('currency').nullable();
      table.float('max_buy', 40, 16).nullable().defaultTo(0);
      table.float('min_buy', 40, 16).nullable().defaultTo(0);
      table.integer('campaign_id').unsigned().notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('reserved_list')
  }
}

module.exports = ReservedListSchema
