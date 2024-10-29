import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import Discount from '#models/discount'
import CartMenu from '#models/cart_menu'

interface CartMenuData {
  productId: Number
  quantity: Number
  notes: String
  discountId: null | Number
}

export default class CartsController {
  async create({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('addcart', { products })
  }

  async store({ response, request, auth }: HttpContext) {
    const data: CartMenuData = request.only(['productId', 'quantity', 'notes', 'discountId'])
    const user = auth.user
    if (!user) return response.unauthorized('You must be logged in to add to the cart')

    let cart =
      (await Cart.query().where('user_id', user.id).orderBy('created_at', 'desc').first()) ||
      (await Cart.create({ userId: user.id, total_amount: 0 }))

    const product = await Product.findOrFail(data.productId)
    const quantity = +data.quantity
    let subtotal = product.price * quantity

    if (data.discountId) {
      const discount = await Discount.find(data.discountId)
      if (discount) subtotal -= subtotal * (discount.percentage / 100)
    }

    const existingCartMenu = await CartMenu.query()
      .where('cart_id', cart.id)
      .where('product_id', product.id)
      .where('notes', data.notes)
      .where('discount_id', data.discountId)
      .first()

    if (existingCartMenu) {
      cart.total_amount -= existingCartMenu.subtotal
      existingCartMenu.quantity += quantity
      existingCartMenu.subtotal = product.price * existingCartMenu.quantity

      if (data.discountId) {
        const discount = await Discount.find(data.discountId)
        if (discount)
          existingCartMenu.subtotal -= existingCartMenu.subtotal * (discount.percentage / 100)
      }

      cart.total_amount += existingCartMenu.subtotal
      await existingCartMenu.save()
    } else {
      await CartMenu.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity,
        notes: data.notes,
        subtotal,
        discount_id: data.discountId,
      })
      cart.total_amount += subtotal
    }

    await cart.save()
    return response.redirect().toRoute('addorder')
  }

  async destroy({ response, params, auth }: HttpContext) {
    const user = auth.user
    const cart = await user.related('carts').query().orderBy('created_at', 'desc').first()
    if (!cart) return response.notFound('Cart not found')

    const cartMenu = await CartMenu.findOrFail(params.id)
    cart.total_amount -= cartMenu.subtotal
    await cartMenu.delete()
    await cart.save()

    return response.redirect().toRoute('addorder')
  }
}
