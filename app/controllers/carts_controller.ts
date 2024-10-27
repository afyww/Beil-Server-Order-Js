import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import Discount from '#models/discount'
import CartMenu from '#models/cart_menu'

interface CartMenuData {
  userId: number
  productId: number
  quantity: number
  notes?: string // Make optional as it's nullable in your Laravel code
  discountId?: number // Optional since it may not always be present
}

export default class CartsController {
  async create({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('addcart', { products })
  }

  async store({ response, request, auth }: HttpContext) {
    const data: CartMenuData = request.only(['productId', 'quantity', 'notes', 'discountId'])

    const user = auth.user
    if (!user) {
      return response.unauthorized('You must be logged in to add to the cart')
    }

    let cart = await Cart.query().where('user_id', user.id).orderBy('created_at', 'desc').first()
    if (!cart) {
      cart = await Cart.create({ user_id: user.id, total_amount: 0 })
    }

    const product = await Product.findOrFail(data.productId)
    const quantity = Number.parseInt(data.quantity.toString()) // Ensure quantity is a number

    let subtotal = Number.parseFloat(product.price.toString()) * quantity // Ensure price is numeric
    let discountAmount = 0

    if (data.discountId) {
      const discount = await Discount.find(data.discountId)
      if (discount) {
        discountAmount = subtotal * (discount.percentage / 100)
        subtotal -= discountAmount // Apply discount
      }
    }

    const existingCartMenu = await CartMenu.query()
      .where('cart_id', cart.id)
      .where('product_id', product.id)
      .where('notes', data.notes)
      .where('discount_id', data.discountId)
      .first()

    if (existingCartMenu) {
      existingCartMenu.quantity += quantity // Update quantity

      let newSubtotal = Number.parseFloat(product.price.toString()) * existingCartMenu.quantity

      if (data.discountId) {
        const discount = await Discount.find(data.discountId)
        if (discount) {
          const newDiscountAmount = newSubtotal * (discount.percentage / 100)
          newSubtotal -= newDiscountAmount // Apply the discount
        }
      }

      cart.total_amount -= existingCartMenu.subtotal // Remove old subtotal from total_amount
      existingCartMenu.subtotal = newSubtotal // Update to the new subtotal
      cart.total_amount += newSubtotal // Add the new subtotal to total_amount
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
}
