import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductImage from 'App/Models/ProductImage'

export default class ProductImagesController {
  public async delete({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const productImage = await ProductImage.findBy('id', request.param('id'))

    if (!productImage) {
      return response.notFound({
        status: 404,
        message: 'Product image not found'
      })
    }

    try {
      await productImage.delete()
      return response.ok({
        status: 200,
        message: 'Product image deleted successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product image failed to delete'
      })
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    try {
      const images: ProductImage[] = []
      for (let image of request.input('images')) {
        const result = await ProductImage.create({
          source: image
        })
        images.push(result)
      }

      return response.created({
        status: 201,
        message: 'Product image created successfully',
        data: images
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product image failed to create'
      })
    }
  }
}
