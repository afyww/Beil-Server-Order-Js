import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settlements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('start_time').nullable()
      table.timestamp('end_time').nullable()
      table.decimal('start_amount', 10, 2).nullable()
      table.decimal('total_amount', 10, 2).nullable()
      table.decimal('expected', 10, 2).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
