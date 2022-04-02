import { DateTime } from 'luxon'
import { afterDelete, BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { appUrl, isDevelopment } from 'Config/app'
import Product from './Product'
import ImageHelper from 'App/Helpers/ImageHelper'

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @column()
  public source: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @computed()
  public get source_url() {
    if (isDevelopment) {
      return 'http://' + appUrl + '/' + this.source
    }
    return 'https://' + appUrl + '/' + this.source
  }

  @afterDelete()
  public static async afterDeleteHook(image: ProductImage) {
    ImageHelper.delete(image.source)
  }
}
