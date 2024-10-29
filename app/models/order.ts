import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cartId: Number

  @column()
  declare no_order: String

  @column()
  declare status: String

  @column()
  declare payment_type: String

  @column()
  declare atas_nama: String

  @column()
  declare no_telpon: String

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>
}
