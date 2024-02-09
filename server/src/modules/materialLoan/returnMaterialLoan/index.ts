import { Material } from '@server/entities'
import { MaterialLoan, materialLoanSchema } from '@server/entities/materialLoan'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    materialLoanSchema.pick({
      id: true,
      countReturned: true,
      description: true,
    })
  )
  .mutation(
    async ({ input: { id, countReturned, description }, ctx: { db } }) =>
      db.transaction(async () => {
        const existingMaterialLoan = await db
          .getRepository(MaterialLoan)
          .findOne({
            where: {
              id,
            },
          })
        if (!existingMaterialLoan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Material Loan not found',
          })
        }

        // count of material
        if (countReturned && countReturned < 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Count returned should be greater than or equal to 0',
          })
        }

        if (countReturned && countReturned > existingMaterialLoan.countTaken) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Count returned should be less than or equal to count taken',
          })
        }

        if (countReturned && countReturned < existingMaterialLoan.countTaken) {
          const material = await db.getRepository(Material).findOne({
            where: {
              id: existingMaterialLoan.material.id,
            },
          })
          if (!material) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Material not found',
            })
          }
          material.remainingCount -=
            existingMaterialLoan.countTaken - countReturned
          await db.getRepository(Material).save(material)
        }

        existingMaterialLoan.countReturned = countReturned
        const currentDate: Date = new Date()
        existingMaterialLoan.returnedDate = currentDate
        existingMaterialLoan.isReturned = true
        existingMaterialLoan.description = description

        await db.getRepository(MaterialLoan).save(existingMaterialLoan)
        return existingMaterialLoan
      })
  )
