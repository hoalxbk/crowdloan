'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StakingLogsSchema extends Schema {
  up () {
    this.create('staking_logs', (table) => {
      table.increments();

      table.string('event', 255).nullable();
      table.string('transaction_hash', 255).nullable();
      table.string('account', 255).nullable();
      table.string('payer', 255).nullable();
      table.decimal('amount', 40,18).notNullable().default(0);

      table.timestamps();
    })
  }

  down () {
    this.drop('staking_logs');
  }
}

module.exports = StakingLogsSchema
