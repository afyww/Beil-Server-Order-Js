import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  public async dashboard({ view }: HttpContext) {
    return view.render('dashboard')
  }
}
