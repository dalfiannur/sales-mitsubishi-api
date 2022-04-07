import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import ProductImage from 'App/Models/ProductImage'
import ProductType from 'App/Models/ProductType'
import ProductStoreValidator from 'App/Validators/ProductStoreValidator'
import ProductUpdateValidator from 'App/Validators/ProductUpdateValidator'

export default class ProductsController {
  public async store({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const { images, types, ...productDTO } = await request.validate(ProductStoreValidator)

    const trx = await Database.transaction()

    try {
      const product = await Product.create(productDTO, {
        client: trx
      })

      for (let productType of types) {
        await ProductType.create({
          productId: product.id,
          ...productType
        }, { client: trx })
      }

      for (let image of images) {
        await ProductImage.create({
          productId: product.id,
          source: image
        }, { client: trx })
      }

      await trx.commit()

      return response.created({
        status: 201,
        message: 'Product created successfully',
        data: product
      })
    } catch {
      await trx.rollback()
      return response.badRequest({
        status: 400,
        message: 'Product could not be created'
      })
    }
  }

  public async paginate({ request, response }: HttpContextContract) {
    const { page = 1, perPage = 10 } = request.qs()

    const products = await Product.query()
      .preload('types')
      .preload('images')
      .paginate(page, perPage)

    return response.ok({
      status: 200,
      message: 'Products paginated successfully',
      ...products.toJSON()
    })
  }

  public async findBySlug({ request, response }: HttpContextContract) {
    const product = await Product.query()
      .preload('types')
      .preload('images')
      .where('slug', request.param('slug'))
      .first()

    if (!product) {
      return response.notFound({
        status: 404,
        message: 'Product not found'
      })
    }

    return response.ok({
      status: 200,
      message: 'Product found successfully',
      data: product
    })
  }

  public async delete({ request, response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const product = await Product.findBy('id', request.param('id'))
    if (!product) {
      return response.notFound({
        status: 404,
        message: 'Product not found'
      })
    }

    try {
      await product.delete()
      return response.ok({
        status: 200,
        message: 'Product deleted successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product failed to delete'
      })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const product = await Product.findBy('id', request.param('id'))
    if (!product) {
      return response.notFound({
        status: 404,
        message: 'Product not found'
      })
    }

    const payload = await request.validate(ProductUpdateValidator)

    try {
      await product.merge(payload).save()
      return response.ok({
        status: 200,
        message: 'Product update successfully',
        data: product
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product failed to update'
      })
    }
  }
}
