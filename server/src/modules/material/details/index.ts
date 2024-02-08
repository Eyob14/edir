import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Material, materialSchema } from '@server/entities/material'
import { MaterialLoan } from '@server/entities'

export default authenticatedProcedure
  .input(
    materialSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const materialDetails = (await db.getRepository(Material).findOne({
      where: {
        id,
      },
      relations: ['expenses'],
    })) as Material

    const materialLoans = await db.getRepository(MaterialLoan).find({
      where: {
        material: {
          id: materialDetails?.id,
        },
      },
      relations: ['user'],
      order: { takenDate: 'DESC' },
    })

    return { materialDetails, materialLoans }
  })
