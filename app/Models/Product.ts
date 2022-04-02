import { DateTime } from 'luxon'
import { afterDelete, afterPaginate, BaseModel, beforePaginate, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import ProductImage from './ProductImage'
import ProductType from './ProductType'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
    allowUpdates: true
  })
  public slug: string

  @column()
  public description: string

  @column()
  public youtubeUrl?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ProductImage)
  public images: HasMany<typeof ProductImage>

  @hasMany(() => ProductType)
  public types: HasMany<typeof ProductType>

  @afterDelete()
  public static async afterDeleteHook(product: Product) {
    const images = await ProductImage.query().where('product_id', product.id).exec()
    images.forEach((image) => {
      image.delete()
    })
    const types = await ProductType.query().where('product_id', product.id).exec()
    types.forEach((type) => {
      type.delete()
    })
  }
}
