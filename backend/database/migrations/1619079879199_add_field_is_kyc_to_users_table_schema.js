'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldIsKycToUserTableSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.boolean('is_kyc').nullable().default(false);
    })
  }

  down () {
    this.table('users', (table) => {
    })
  }
}

module.exports = AddFieldIsKycToUserTableSchema;
