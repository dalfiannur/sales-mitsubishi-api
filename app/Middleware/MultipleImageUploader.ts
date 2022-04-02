import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { resolve } from 'path'
import { mkdirSync, existsSync } from 'fs'
import sharp from 'sharp'

export default class MultipleImageUploader {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>, paths: string[]) {
    const uploadDir = resolve(__dirname, '../../upload/images')

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    const images: string[] = request.input(paths[0])
    const imagePaths: string[] = []
    for (let image of images) {
      const base64 = image.split(';base64,')[1]
      const buffer = Buffer.from(base64, 'base64')
      const filename = Date.now() + '.webp'

      await sharp(buffer)
        .webp({
          quality: 80
        })
        .toFile(uploadDir + '/' + filename)

      imagePaths.push('images/' + filename)
    }

    request.updateBody({
      ...request.body(),
      [paths[0]]: imagePaths
    })

    await next()
  }
}
