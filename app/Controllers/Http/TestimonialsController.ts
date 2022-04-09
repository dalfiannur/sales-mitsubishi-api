import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageHelper from 'App/Helpers/ImageHelper'
import Testimonial from 'App/Models/Testimonial'
import TestimonialStoreValidator from 'App/Validators/TestimonialStoreValidator'
import TestimonialUpdateValidator from 'App/Validators/TestimonialUpdateValidator'

export default class TestimonialsController {
  public async store({ request, auth, response }: HttpContextContract) {
    auth.use('api').authenticate()

    const payload = await request.validate(TestimonialStoreValidator)

    try {
      const testimonial = await Testimonial.create(payload)
      return response.ok({
        status: 200,
        message: 'Testimonial created successfully',
        data: testimonial
      })
    } catch (error) {
      return response.badRequest({
        status: 400,
        message: 'Testimonial failed to create',
      })
    }
  }

  public async paginate({ params, response }: HttpContextContract) {
    const { page = 1, perPage = 5 } = params

    const data = await Testimonial.query()
      .paginate(page, perPage)

    return response.ok({
      status: 200,
      message: 'Testimonials paginated successfully',
      ...data.toJSON()
    })
  }

  public async update({ params, response, request, auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const testimonial = await Testimonial.findBy('id', params.id)

    if (!testimonial) {
      return response.notFound({
        status: 404,
        message: 'Testimonial not found'
      })
    }

    const payload = await request.validate(TestimonialUpdateValidator)

    try {
      await testimonial.merge(payload).save()

      return response.ok({
        status: 200,
        message: 'Testimonial updated successfully',
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Testimonial failed to update'
      })
    }
  }

  public async updateImage({ auth, request, response, params }: HttpContextContract) {
    await auth.use('api').authenticate()

    const testimonial = await Testimonial.findBy('id', params.id)

    if (!testimonial) {
      return response.notFound({
        status: 404,
        message: 'Testimonial not found'
      })
    }

    const image = request.input('image')
    if (image) {
      ImageHelper.delete(testimonial.image)
      testimonial.image = image
    }

    const avatar = request.input('avatar')
    if (avatar) {
      ImageHelper.delete(testimonial.avatar)
      testimonial.avatar = avatar
    }

    try {
      await testimonial.save()
      return response.ok({
        status: 200,
        message: 'Testimonial Image or Avatar updated successfully',
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Testimonial Image or Avatar failed to update'
      })
    }
  }

  public async delete({ params, auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const testimonial = await Testimonial.findBy('id', params.id)

    if (!testimonial) {
      return response.notFound({
        status: 404,
        message: 'Testimonial not found'
      })
    }

    try {
      await testimonial.delete()

      return response.ok({
        status: 200,
        message: 'Testimonial deleted successfully',
      })
    } catch {
      return response.badRequest({
        status: 400,
        message: 'Testimonial failed to delete'
      })
    }
  }
}
