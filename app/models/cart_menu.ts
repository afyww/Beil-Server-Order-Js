import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'
import Product from './product.js'
import Discount from './discount.js'

export default class CartMenu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cartId: Number

  @column()
  declare productId: Number

  @column()
  declare discountId: Number

  @column()
  declare notes: String

  @column()
  declare quantity: Number

  @column()
  declare subtotal: Number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Discount)
  declare discount: BelongsTo<typeof Discount>
}
