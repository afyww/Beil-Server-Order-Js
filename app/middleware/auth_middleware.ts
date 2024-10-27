import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used to authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  redirectTo = '/'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // Check if the user is present in the session
    const user = ctx.session.get('user')
    if (!user) {
      return ctx.response.redirect().toRoute(this.redirectTo)
    }

    // Optionally, authenticate the user based on your guards
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

    return next()
  }
}
