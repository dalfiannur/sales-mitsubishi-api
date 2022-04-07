import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Testimonials extends BaseSchema {
  protected tableName = 'testimonials'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.string('position').nullable()
      table.string('content')
      table.string('image')
      table.string('avatar')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
