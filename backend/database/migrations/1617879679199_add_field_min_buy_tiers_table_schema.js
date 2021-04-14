'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldMinBuyToTiersTableSchema extends Schema {
  up () {
    this.table('tiers', (table) => {
      // alter table
      table.integer('min_buy').nullable().defaultTo(0);
    })
  }

  down () {
    this.table('tiers', (table) => {
    })
  }
}

module.exports = AddFieldMinBuyToTiersTableSchema;
