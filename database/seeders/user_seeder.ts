import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        fullName: 'Admin',
        level: 'admin',
        email: 'Admin@gmail.com',
        password: '123456',
        qrToken: uuidv4(), // Use uuidv4() correctly
      },
    ])
  }
}
