'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsToWinnerTableSchema extends Schema {
  up () {
    this.table('winner_list', (table) => {
      // alter table
      table.integer('lottery_ticket').unsigned().nullable().default(0);
      table.integer('level').unsigned().notNullable().default(0);
    })
  }

  down () {
    this.table('winner_list', (table) => {
    })
  }
}

module.exports = AddFieldsToWinnerTableSchema;
