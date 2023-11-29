import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/', async (req, res) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserSchema.parse(req.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return res.status(201).send()
  })
}
