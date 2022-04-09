import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { AssetHelper } from 'App/Helpers/AssetHelper'

export default class Testimonial extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public position: string

  @column()
  public content: string

  @column()
  public image: string

  @computed()
  public get imageUrl() {
    return AssetHelper.getUrl(this.image)
  }

  @column()
  public avatar: string

  @computed()
  public get avatarUrl() {
    return AssetHelper.getUrl(this.avatar)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
