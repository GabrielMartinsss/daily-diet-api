import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/:userId', async (req, res) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(req.params)

    const meals = await knex('meals')
      .where({
        user_id: userId,
      })
      .select()

    if (meals) {
      return { meals }
    }

    return res.status(404).send()
  })

  app.get('/:userId/:mealId', async (req, res) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
      mealId: z.string().uuid(),
    })

    const { userId, mealId } = getMealParamsSchema.parse(req.params)

    const meal = await knex('meals')
      .where({
        user_id: userId,
        id: mealId,
      })
      .first()

    if (meal) {
      return { meal }
    }

    return res.status(404).send()
  })

  app.post('/:userId', async (req, res) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealParamsSchema.parse(req.params)

    const getMealsBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isDiet: z.enum(['true', 'false']),
    })

    const { title, description, isDiet } = getMealsBodySchema.parse(req.body)

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      title,
      description,
      is_diet: isDiet,
    })

    res.status(201).send()
  })

  app.delete('/:userId/:mealId', async (req, res) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
      mealId: z.string().uuid(),
    })

    const { userId, mealId } = getMealParamsSchema.parse(req.params)

    await knex('meals')
      .where({
        user_id: userId,
        id: mealId,
      })
      .del()

    res.status(200).send()
  })

  app.put('/:userId/:mealId', async (req, res) => {
    const getMealParamsSchema = z.object({
      userId: z.string().uuid(),
      mealId: z.string().uuid(),
    })

    const { userId, mealId } = getMealParamsSchema.parse(req.params)

    const getMealsBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isDiet: z.enum(['true', 'false']),
    })

    const { title, description, isDiet } = getMealsBodySchema.parse(req.body)

    await knex('meals')
      .where({
        user_id: userId,
        id: mealId,
      })
      .update({
        title,
        description,
        is_diet: isDiet,
      })

    return res.status(201).send()
  })

  app.get('/summary/:userId', async (req, res) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(req.params)

    const totalMeals = await knex('meals')
      .where({
        user_id: userId,
      })
      .count('*', { as: 'total_meals' })
      .first()

    const totalMealsInDiet = await knex('meals')
      .where({
        user_id: userId,
        is_diet: 'true',
      })
      .count('*', { as: 'total_meals_in_diet' })
      .first()

    const totalMealsOutDiet = await knex('meals')
      .where({
        user_id: userId,
        is_diet: 'false',
      })
      .count('*', { as: 'total_meals_out_diet' })
      .first()

    if (totalMeals && totalMealsInDiet && totalMealsOutDiet) {
      return { ...totalMeals, ...totalMealsInDiet, ...totalMealsOutDiet }
    }

    return res.status(404).send()
  })
}
