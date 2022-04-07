import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageHelper from 'App/Helpers/ImageHelper';
import Banner from 'App/Models/Banner';

export default class BannersController {
  public async paginate({ request, response }: HttpContextContract) {
    const { page = 1, perPage = 5 } = request.qs()
    const paginate = await Banner.query().paginate(page, perPage)
    return response.ok({
      status: 200,
      message: 'Banners paginated successfully',
      ...paginate.toJSON()
    })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const count = await Banner.query().select('id').exec()

    if (count.length >= 5) {
      return response.badRequest({
        status: 400,
        message: 'You can only create 5 Banners'
      })
    }

    try {
      const banner = await Banner.create({
        source: request.input('image')
      })

      return response.ok({
        status: 200,
        message: 'Banner created successfully',
        data: banner
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Fail to create Banner'
      })
    }
  }

  public async delete({ request, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const banner = await Banner.findBy('id', request.param('id'))

    if (!banner) {
      return response.notFound({
        status: 404,
        message: 'Banner not found'
      })
    }

    try {
      const path = banner.source
      await banner.delete()
      ImageHelper.delete(path)
      return response.ok({
        status: 200,
        message: 'Banner deleted successfully'
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Fail to delete Banner'
      })
    }
  }
}
