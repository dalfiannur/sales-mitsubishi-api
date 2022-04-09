import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { AssetHelper } from 'App/Helpers/AssetHelper'

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public source: string

  @computed()
  public get source_url() {
    return AssetHelper.getUrl(this.source)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
