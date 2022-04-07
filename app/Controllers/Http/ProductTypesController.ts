import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductType from 'App/Models/ProductType'
import ProductTypeStoreValidator from 'App/Validators/ProductTypeStoreValidator'
import ProductTypeUpdateValidator from 'App/Validators/ProductTypeUpdateValidator'

export default class ProductTypesController {
  public async delete({ request, response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const data = await ProductType.findBy('id', request.param('id'))

    if (!data) {
      return response.notFound({
        status: 404,
        message: 'Product type not found'
      })
    }

    try {
      await data.delete()
      return response.ok({
        status: 200,
        message: 'Product type deleted successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product type failed to delete'
      })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const type = await ProductType.findBy('id', request.param('id'))

    if (!type) {
      return response.notFound({
        status: 404,
        message: 'Product type not found'
      })
    }

    const payload = await request.validate(ProductTypeUpdateValidator)
    try {
      await type.merge(payload).save()
      return response.ok({
        status: 200,
        message: 'Product type updated successfully',
        data: type
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Product type failed to update'
      })
    }
  }

  public async store({ auth, request, response, params }: HttpContextContract) {
    await auth.use('api').authenticate()

    const product = await Product.findBy('id', params.productId)

    if (!product) {
      return response.notFound({
        status: 404,
        message: 'Product not found'
      })
    }

    const payload = await request.validate(ProductTypeStoreValidator)

    try {
      const productType = await ProductType.create({
        ...payload,
        productId: product.id
      })

      return response.ok({
        status: 200,
        message: 'Product type created successfully',
        data: productType
      })
    } catch (errors) {
      return response.badRequest({
        status: 400,
        message: 'Product type failed to create',
        errors
      })
    }
  }
}
