import { Material } from '@server/entities'
import { MaterialLoan, materialLoanSchema } from '@server/entities/materialLoan'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    materialLoanSchema.pick({
      id: true,
      countTaken: true,
      reason: true,
      requestedDate: true,
    })
  )
  .mutation(
    async ({
      input: { id, countTaken, reason, requestedDate },
      ctx: { db },
    }) => {
      const existingMaterialLoan = await db
        .getRepository(MaterialLoan)
        .findOne({ where: { id }, relations: ['material'] })

      if (!existingMaterialLoan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'material loan data not found',
        })
      }

      if (existingMaterialLoan.isApproved) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Material loan has been approved, cannot be updated',
        })
      }

      const material = await db
        .getRepository(Material)
        .findOne({ where: { id: existingMaterialLoan.material.id } })

      if (material && material.remainingCount < countTaken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Not enough ${material.name} in store`,
        })
      }

      existingMaterialLoan.countTaken = countTaken
      existingMaterialLoan.reason = reason
      existingMaterialLoan.requestedDate = requestedDate

      await db.getRepository(MaterialLoan).save(existingMaterialLoan)

      return existingMaterialLoan
    }
  )
