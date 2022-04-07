import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropTableArticles extends BaseSchema {
  protected tableName = 'articles'

  public async up () {
    this.schema.dropTableIfExists(this.tableName)
  }

  public async down () {
    // this.schema.dropTable(this.tableName)
  }
}
