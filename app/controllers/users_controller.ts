import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

interface UserData {
  fullName: any
  email: any
  password: any
}

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.query().where('level', 'admin').exec()
    return view.render('user', { users })
  }

  async create({ view }: HttpContext) {
    return view.render('adduser')
  }

  async store({ request, response }: HttpContext) {
    const data: UserData = request.only(['fullName', 'email', 'password'])
    await User.create(data)
    return response.redirect().toRoute('user')
  }

  async edit({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('edituser', { user })
  }

  async update({ request, view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data: UserData = request.only(['fullName', 'email', 'password'])
    user.merge(data)
    await user.save()

    return view.render('user')
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.redirect().toRoute('user')
  }
}
