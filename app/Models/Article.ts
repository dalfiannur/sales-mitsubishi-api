import { DateTime } from 'luxon'
import { afterDelete, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import ImageHelper from 'App/Helpers/ImageHelper';

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string;

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true
  })
  public slug: string;

  @column()
  public content: string;

  @column()
  public thumbnail: string;

  @column()
  public author: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterDelete()
  public static async deleteThumbnail(article: Article) {
    ImageHelper.delete(article.thumbnail)
  }
}
