import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageHelper from 'App/Helpers/ImageHelper'
import News from 'App/Models/News'
import NewsStoreValidator from 'App/Validators/NewsStoreValidator'
import NewsUpdateValidator from 'App/Validators/NewsUpdateValidator'

export default class NewsController {
  public async store({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const payload = await request.validate(NewsStoreValidator)

    try {
      const news = await News.create({
        ...payload,
        userId: auth.user!.id
      })

      return response.created({
        status: 201,
        message: 'News created successfully',
        data: news
      })
    } catch (errors) {
      return response.badRequest({
        status: 400,
        message: 'News could not be created',
        errors
      })
    }
  }

  public async update({ request, auth, response, params }: HttpContextContract) {
    await auth.use('api').authenticate()

    const news = await News.findBy('id', params.id)

    if (!news) {
      return response.notFound({
        status: 404,
        message: 'News not found'
      })
    }

    const payload = await request.validate(NewsUpdateValidator)

    try {
      if (payload.thumbnail) {
        ImageHelper.delete(news.thumbnail)
      }

      await news.merge({ ...news, ...payload }).save()

      return response.ok({
        status: 200,
        message: 'News update successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'News failed to update'
      })
    }
  }

  public async paginate({ request, response }: HttpContextContract) {
    const { page = 1, perPage = 10 } = request.qs()

    const news = await News.query()
      .preload('user')
      .paginate(page, perPage)

    return response.ok({
      status: 200,
      message: 'News paginated successfully',
      ...news.toJSON()
    })
  }

  public async findBySlug({ request, response }: HttpContextContract) {
    const news = await News.query()
      .where('slug', request.param('slug'))
      .preload('user')
      .first()

    if (!news) {
      return response.notFound('News not found')
    }

    return response.ok({
      status: 200,
      message: 'News found successfully',
      data: news
    })
  }

  public async delete({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const news = await News.findBy('id', request.param('id'))

    if (!news) {
      return response.notFound('News not found')
    }

    try {
      await news.delete()

      return response.ok({
        status: 200,
        message: 'News deleted successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'News failed to delete'
      })
    }
  }
}
