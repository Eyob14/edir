import { Material, materialSchema } from '@server/entities/material'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    materialSchema.pick({
      id: true,
      name: true,
      boughtAt: true,
      initialCount: true,
      remainingCount: true,
      description: true,
      image: true,
    })
  )
  .mutation(
    async ({
      input: {
        id,
        name,
        boughtAt,
        initialCount,
        remainingCount,
        description,
        image,
      },
      ctx: { db },
    }) => {
      const existingMaterial = await db
        .getRepository(Material)
        .findOne({ where: { id } })

      if (!existingMaterial) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'material not found',
        })
      }

      existingMaterial.name = name
      existingMaterial.boughtAt = boughtAt
      existingMaterial.description = description
      existingMaterial.initialCount = initialCount
      existingMaterial.remainingCount = remainingCount
      existingMaterial.image = image
      await db.getRepository(Material).save(existingMaterial)

      return existingMaterial
    }
  )
