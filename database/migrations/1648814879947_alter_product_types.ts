import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterProductTypes extends BaseSchema {
  protected tableName = 'product_types'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('transmission')
      table.string('fuel')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('transmission')
      table.dropColumn('fuel')
    })
  }
}
