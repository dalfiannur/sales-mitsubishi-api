import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterTableNewsColumnContents extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content').alter();
    })
  }

  public async down () {
    // this.schema.dropTable(this.tableName)
  }
}
