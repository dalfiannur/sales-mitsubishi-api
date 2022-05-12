import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterTableNewsColumnContents extends BaseSchema {
  protected tableName = 'alter_table_news_column_contents'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content');
    })
  }

  public async down () {
    // this.schema.dropTable(this.tableName)
  }
}
