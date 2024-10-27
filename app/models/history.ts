import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class History extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare chair: string

  @column()
  declare name: string

  @column()
  declare no_order: string

  @column()
  declare order: string

  @column()
  declare payment_type: string

  @column()
  declare total_amount: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
