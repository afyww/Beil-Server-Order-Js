import Expense from '#models/expense'
import type { HttpContext } from '@adonisjs/core/http'

interface ExpenseData {
  name: string
  nominal: string
}

export default class ExpensesController {
  async index({ view }: HttpContext) {
    const expenses = await Expense.all()
    return view.render('expense', { expenses })
  }

  async create({ view }: HttpContext) {
    return view.render('addexpense')
  }

  async store({ response, request }: HttpContext) {
    const data: ExpenseData = request.only(['name', 'nominal'])
    await Expense.create(data)
    return response.redirect().toRoute('expense')
  }

  async edit({ view, params }: HttpContext) {
    const expense = await Expense.findOrFail(params.id)
    return view.render('editexpense', { expense })
  }

  async update({ request, response, params }: HttpContext) {
    const expense = await Expense.findOrFail(params.id)
    const data: ExpenseData = request.only(['name', 'nominal'])
    expense.merge(data)
    await expense.save()

    return response.redirect().toRoute('discount')
  }

  async destroy({ params, response }: HttpContext) {
    const expense = await Expense.findOrFail(params.id)
    await expense.delete()
    return response.redirect().toRoute('discount')
  }
}
