import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import ProductImage from 'App/Models/ProductImage'
import ProductType from 'App/Models/ProductType'
import ProductStoreValidator from 'App/Validators/ProductStoreValidator'

export default class ProductsController {
    public async store({ request, auth }: HttpContextContract) {
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
        } catch {
            await trx.rollback()
        }

        return {
            status: 'oke'
        }
    }

    public async paginate() {
        return await Product.query()
            .preload('types')
            .preload('images')
            .paginate(1, 20)
    }

    public async findBySlug({ request, response }: HttpContextContract) {
        const product = await Product.query()
            .preload('types')
            .preload('images')
            .where('slug', request.param('slug'))
            .first()

        if (!product) {
            return response.notFound('Product not found')
        }

        return product
    }

    public async delete({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()

        const product = await Product.findBy('id', request.param('id'))
        if (!product) {
            return response.notFound('Product not found')
        }

        await product.delete()

        return response.noContent()
    }

    public async update({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()

        const product = await Product.findBy('id', request.param('id'))
        if (!product) {
            return response.notFound('Product not found')
        }

        product.merge(request.only(['name', 'description', 'youtubeUrl']))
        await product.save()

        return product
    }
}
