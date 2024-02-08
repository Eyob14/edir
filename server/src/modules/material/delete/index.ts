import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { Material, materialSchema } from '@server/entities/material'

export default adminProcedure
  .input(
    materialSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const material = await db.getRepository(Material).findOne({
      where: {
        id,
      },
    })

    if (!material) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'material not found',
      })
    }

    await db.getRepository(Material).delete(id)
    return material
  })
