import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  async index({ view }: HttpContext) {
    return view.render('login')
  }

  async login({ view, request, response, session }: HttpContext) {
    const email: string = request.input('email')
    const password: string = request.input('password')

    const user = await User.query().where('email', email).first()
    if (!user) {
      return view.render('login', { error: 'Invalid email or password.' })
    }

    if (!(await hash.verify(user.password, password))) {
      return view.render('login', { error: 'Invalid email or password.' })
    }

    // Store user details in session
    session.put('user', {
      id: user.id,
      fullName: user.fullName, // Assuming user model has fullName
    })

    return response.redirect().toRoute('dashboard')
  }

  async logout({ response, session }: HttpContext) {
    // Clear session on logout
    session.forget('user')
    return response.redirect().toRoute('index')
  }
}
