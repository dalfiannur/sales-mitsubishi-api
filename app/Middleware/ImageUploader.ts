import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { resolve } from 'path'
import { mkdirSync, existsSync } from 'fs'
import sharp from 'sharp'

export default class ImageUploader {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>, paths: string[]) {
    const uploadDir = resolve(__dirname, '../../upload/images')

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    const image: string = request.input(paths[0])

    if (image) {
      const base64 = image.split(';base64,')[1]
      const buffer = Buffer.from(base64, 'base64')
      const filename = Date.now() + '.webp'

      await sharp(buffer)
        .webp({
          quality: 80
        })
        .toFile(uploadDir + '/' + filename)

      const path = 'images/' + filename

      request.updateBody({
        ...request.body(),
        [paths[0]]: path
      })
    }



    await next()
  }
}
