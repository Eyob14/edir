import { Penalty, penaltySchema } from '@server/entities/penalty'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    penaltySchema.pick({
      id: true,
      paymentDate: true,
      amount: true,
      reason: true,
    })
  )
  .mutation(
    async ({ input: { id, amount, reason, paymentDate }, ctx: { db } }) => {
      const existingPenalty = await db
        .getRepository(Penalty)
        .findOne({ where: { id } })

      if (!existingPenalty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'penalty not found',
        })
      }

      existingPenalty.amount = amount
      existingPenalty.paymentDate = paymentDate
      existingPenalty.reason = reason

      await db.getRepository(Penalty).save(existingPenalty)

      return existingPenalty
    }
  )
