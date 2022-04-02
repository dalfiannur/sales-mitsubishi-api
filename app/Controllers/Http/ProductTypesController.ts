import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductType from 'App/Models/ProductType'

export default class ProductTypesController {
    public async delete({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()

        const data = await ProductType.findBy('id', request.param('id'))

        if (!data) {
            return response.notFound('Product type not found')
        }

        await data.delete()

        return response.noContent()
    }

    public async update({ request, response, auth }: HttpContextContract) {
        const data = await ProductType.findBy('id', request.param('id'))

        if (!data) {
            return response.notFound('Product type not found')
        }

        data.merge(request.all())

        await data.save()

        return data
    }
}
