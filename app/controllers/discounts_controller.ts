import Discount from '#models/discount'
import type { HttpContext } from '@adonisjs/core/http'

interface DiscountData {
  name: string
  percentage: string
}

export default class DiscountsController {
  async index({ view }: HttpContext) {
    const discounts = await Discount.all()
    return view.render('discount', { discounts })
  }

  async create({ view }: HttpContext) {
    return view.render('adddiscount')
  }

  async store({ response, request }: HttpContext) {
    const data: DiscountData = request.only(['name', 'percentage'])
    await Discount.create(data)
    return response.redirect().toRoute('discount')
  }

  async edit({ view, params }: HttpContext) {
    const discount = await Discount.findOrFail(params.id)
    return view.render('editdiscount', { discount })
  }

  async update({ request, response, params }: HttpContext) {
    const discount = await Discount.findOrFail(params.id)
    const data: DiscountData = request.only(['name', 'percentage'])
    discount.merge(data)
    await discount.save()

    return response.redirect().toRoute('discount')
  }

  async destroy({ params, response }: HttpContext) {
    const discount = await Discount.findOrFail(params.id)
    await discount.delete()
    return response.redirect().toRoute('discount')
  }
}
