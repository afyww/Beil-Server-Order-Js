import History from '#models/history'
import type { HttpContext } from '@adonisjs/core/http'

export default class HistoriesController {
  async index({ view }: HttpContext) {
    const histories = await History.all()
    return view.render('history', { histories })
  }
}
