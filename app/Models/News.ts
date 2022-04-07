import { DateTime } from 'luxon'
import { afterDelete, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import ImageHelper from 'App/Helpers/ImageHelper';
import User from './User';

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number;

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterDelete()
  public static async deleteThumbnail(news: News) {
    ImageHelper.delete(news.thumbnail)
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
