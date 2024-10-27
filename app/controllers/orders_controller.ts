import Order from '#models/order'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  async index({ view }: HttpContext) {
    const orders = await Order.query().preload('carts')
    return view.render('order', { orders })
  }

  async create({ auth, view }: HttpContext) {
    const user = auth.user!
    let cart = await user
      .related('carts')
      .query()
      .preload('cartMenus', (cartMenuQuery) => {
        cartMenuQuery.preload('product') // Preload the associated product
      })
      .orderBy('created_at', 'desc')
      .first()
    if (!cart) {
      cart = await user.related('carts').create({})
    }

    return view.render('addorder', { cart })
  }
}
