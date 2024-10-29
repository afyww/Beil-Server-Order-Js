/* eslint-disable @typescript-eslint/naming-convention */
import Order from '#models/order'
import Cart from '#models/cart'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

const MIDTRANS_URL =
  process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://api.midtrans.com/v2/transactions'
    : 'https://api.sandbox.midtrans.com/v2/transactions'

export default class OrdersController {
  async index({ view }: HttpContext) {
    const orders = await Order.query().preload('cart')
    return view.render('order', { orders })
  }

  async create({ auth, view }: HttpContext) {
    const user = auth.user!
    let cart = await user
      .related('carts')
      .query()
      .preload('cartMenus', (cartMenuQuery) => {
        cartMenuQuery.preload('product').preload('discount')
      })
      .orderBy('created_at', 'desc')
      .first()

    if (!cart) {
      cart = await user.related('carts').create({})
    }

    return view.render('addorder', { cart })
  }

  async store({ auth, request, view }: HttpContext) {
    const user = auth.user
    if (!user) {
      return view.render('errors/unauthorized')
    }

    const no_telpon = request.input('no_telpon')
    const atas_nama = request.input('atas_nama')

    if (!no_telpon || !atas_nama) {
      return view.render('errors/invalidData')
    }

    const cart = await user
      .related('carts')
      .query()
      .preload('cartMenus', (cartMenuQuery) => {
        cartMenuQuery.preload('product') // Preload the product for each cartMenu
      })
      .orderBy('created_at', 'desc')
      .first()

    if (!cart) {
      return view.render('errors/cartNotFound')
    }

    const orderId = cuid().slice(0, 5) // Generate a unique order ID

    const itemDetails =
      cart.cartMenus && cart.cartMenus.length > 0
        ? [
            {
              name: cart.cartMenus
                .map((menu) => menu.product?.name || 'Unknown Product')
                .join(', '),
              price: cart.total_amount,
              quantity: 1,
            },
          ]
        : [] // Fallback if cartMenus is undefined or empty

    const params = {
      transaction_details: {
        order_id: orderId,
        gross_amount: cart.total_amount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: no_telpon,
      },
      credit_card: {
        secure: true,
      },
    }

    const order = new Order()
    order.cartId = cart.id
    order.no_order = orderId
    order.atas_nama = atas_nama
    order.no_telpon = no_telpon
    await order.save()

    try {
      // Using axios to send the transaction request
      const response = await axios.post(MIDTRANS_URL, params, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        },
      })

      const snapToken = response.data.token // Assuming the response has a token field

      await Cart.create({ userId: user.id }) // Create a new cart for the user

      return view.render('checkout', { snapToken, order: { cart } });
    } catch (error) {
      console.error('Midtrans transaction error:', error)
      return view.render('errors/transactionFailed', { error: error.message })
    }
  }
}
