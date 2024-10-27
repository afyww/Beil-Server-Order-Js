import Category from '#models/category'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

interface ProductData {
  name: string
  price: number
  description: string
  category_id: number
  img?: string
}

export default class ProductsController {
  async index({ view }: HttpContext) {
    const products = await Product.all()
    return view.render('product', { products })
  }

  async create({ view }: HttpContext) {
    const categories = await Category.all()
    return view.render('addproduct', { categories })
  }

  async store({ response, request }: HttpContext) {
    const data: ProductData = request.only(['name', 'img', 'price', 'description', 'category_id'])
    const img = request.file('img', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (img && img.isValid) {
      await img.move(app.makePath('storage/uploads'), {
        name: img.clientName,
      })

      data.img = img.clientName
    }

    await Product.create(data)
    return response.redirect().toRoute('product')
  }

  async edit({ view, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const categories = await Category.all() // You might want to get categories for the edit view as well
    return view.render('editproduct', { product, categories }) // Note: Fixed the spelling of 'editproduct'
  }

  async update({ request, response, params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const data: ProductData = request.only(['name', 'price', 'description', 'category_id'])

    const img = request.file('img', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (img && img.isValid) {
      await img.move(app.makePath('storage/uploads'), {
        name: img.clientName,
      })

      data.img = img.clientName
    }

    product.merge(data)
    await product.save()

    return response.redirect().toRoute('product')
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.redirect().toRoute('product')
  }
}
