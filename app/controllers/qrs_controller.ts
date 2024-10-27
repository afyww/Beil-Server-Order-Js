import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import QRCode from 'qrcode'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import path from 'node:path'

export default class QrsController {
  async userQr({ params, response, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const qrToken = user.qrToken
    const url = `https://beilcoff.shop/login?qrToken=${qrToken}`

    const dirPath = path.join(app.makePath('storage/uploads'))
    const filename = `${user.id}.svg` // Use user ID for filename to ensure uniqueness
    const filePath = path.join(dirPath, filename)

    if (fs.existsSync(filePath)) {
      return view.render('qrcode', { filename, user }) // Serve the existing QR code
    }

    try {
      const qrCode = await QRCode.toString(url, { type: 'svg' })

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      fs.writeFileSync(filePath, qrCode)

      return view.render('qrcode', { filename, user }) // Render the new QR code
    } catch (error) {
      console.error(error)
      return response.status(500).send('Error generating QR Code')
    }
  }
}
