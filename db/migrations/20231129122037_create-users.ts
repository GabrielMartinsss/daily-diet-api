import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })

  knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.foreign('user_id').references('id').inTable('users')
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.enum('is_diet', ['true', 'false']).defaultTo('false')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals').dropTable('users')
}
