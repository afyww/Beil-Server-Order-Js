import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Settlement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: Number

  @column()
  declare start_time: DateTime

  @column()
  declare end_time: DateTime

  @column()
  declare start_amount: Number

  @column()
  declare total_amount: Number

  @column()
  declare expected: Number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>
}
