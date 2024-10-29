import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('chair')
      table.string('name')
      table.string('no_order')
      table.string('order')
      table.string('payment_type')
      table.integer('total_amount').nullable()
      table.string('status')
      table.integer('settlement_id').unsigned().references('settlements.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
