import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class ChairsController {
  async index({ view }: HttpContext) {
    const chairs = await User.query().where('level', 'user').exec()
    return view.render('chair', { chairs })
  }

  async create({ view }: HttpContext) {
    return view.render('addchair')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password', 'qrToken'])
    data.email = `${uuidv4().substring(0, 8)}@gmail.com`
    data.password = Math.random().toString(36).slice(-10)
    data.qrToken = uuidv4()
    await User.create(data)
    return response.redirect().toRoute('chair')
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.redirect().toRoute('user')
  }
}
