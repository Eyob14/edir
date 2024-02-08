import { User } from '@server/entities'
import { userSchema } from '@server/entities/user'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    userSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {

    const existingUser = (await db.getRepository(User).findOne({
      select: {
        id: true,
        isVerified: true,
      },
      where: {
        id,
      },
    })) as Pick<User, 'id' | 'role' | 'isVerified'> | undefined
    if (!existingUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user not found',
      })
    }

    existingUser.isVerified = true
    await db.getRepository(User).save(existingUser)
    return existingUser
  })
