import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Article from 'App/Models/Article'

export default class ArticlesController {
  public async store({ request, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const article = await Article.create(request.all())

    return article
  }

  public async update({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const article = await Article.findBy('slug', request.param('slug'))

    if (!article) {
      return response.notFound('Article not found')
    }

    return await article.merge({
      ...article,
      ...request.all()
    }).save()
  }

  public async paginate({ request, auth, response }: HttpContextContract) {
    const { page = 1, perPage = 10 } = request.qs()

    return Article.query().paginate(page, perPage)
  }

  public async findBySlug({ request, auth, response }: HttpContextContract) {
    const article = await Article.findBy('slug', request.param('slug'))

    if (!article) {
      return response.notFound('Article not found')
    }

    return article
  }

  public async delete({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const article = await Article.findBy('id', request.param('id'))

    if (!article) {
      return response.notFound('Article not found')
    }

    await article.delete()

    return response.noContent()
  }


}
