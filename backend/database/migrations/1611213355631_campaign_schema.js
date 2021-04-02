'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Const = use('App/Common/Const');

class CampaignSchema extends Schema {
  up () {
    this.create('campaigns', (table) => {
      table.increments()
      table.string('title')
      table.string('token')
      table.string('registed_by')
      table.string('campaign_hash')
      table.bigInteger('campaign_id')
      table.string('funding_wallet_address')
      table.boolean('affiliate')
      table.string('start_time')
      table.string('finish_time')
      table.string('token_conversion_rate')
      table.string('ether_conversion_rate')
      table.boolean('is_pause')
      table.string('transaction_hash')
      table
        .tinyint('blockchain_status')
        .notNullable()
        .defaultTo(Const.OPERATORS_BLOCKCHAIN_ADDRESS_STATUS.REGISTRATION_WAITING_TX_FROM_CLIENT);
      table.string('registration_tx', 100).nullable();
      table.string('registration_from', 100).nullable();
      table.string('deleted_tx', 100).nullable();
      table.string('deleted_from', 100).nullable();
      table.integer('decimals')
      table.string('name')
      table.string('symbol')
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('campaigns')
  }
}

module.exports = CampaignSchema
