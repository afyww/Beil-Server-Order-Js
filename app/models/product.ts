import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import CartMenu from './cart_menu.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: String

  @column()
  declare price: Number

  @column()
  declare img: String

  @column()
  declare description: String

  @column()
  declare categoryId: Number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => CartMenu)
  declare cartMenus: HasMany<typeof CartMenu>
}
