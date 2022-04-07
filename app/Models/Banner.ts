import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { appUrl, isDevelopment } from 'Config/app'

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public source: string

  @computed()
  public get source_url() {
    if (isDevelopment) {
      return 'http://' + appUrl + '/' + this.source
    }
    return 'https://' + appUrl + '/' + this.source
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
