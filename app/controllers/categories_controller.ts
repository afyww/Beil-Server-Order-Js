import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

interface CategoryData {
  name: string
}

export default class CategoriesController {
  async index({ view }: HttpContext) {
    const categories = await Category.query().preload('products')
    return view.render('category', { categories })
  }

  async create({ view }: HttpContext) {
    return view.render('addcategory')
  }

  async store({ response, request }: HttpContext) {
    const data: CategoryData = request.only(['name'])
    await Category.create(data)
    return response.redirect().toRoute('category')
  }

  async edit({ view, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return view.render('editcategory', { category })
  }

  async update({ request, response, params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data: CategoryData = request.only(['name'])
    category.merge(data)
    await category.save()

    return response.redirect().toRoute('category')
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.redirect().toRoute('category')
  }
}
