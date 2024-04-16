import bcrypt from 'bcrypt'
import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import { TRPCError } from '@trpc/server'
import { userSchema } from '@server/entities/user'
import { prepareTokenPayload } from '../tokenPayload'

const { expiresIn, tokenKey } = config.auth

export default publicProcedure
  .input(
    userSchema.pick({
      email: true,
      password: true,
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { db } }) => { 
    const user = (await db.getRepository(User).findOne({
      select: {
        id: true,
        password: true,
        role: true,
        isVerified: true,
      },
      where: {
        email,
      },
    })) as User | undefined

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with this email address',
      })
    }

    if (!user.isVerified) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Your account is not verified yet.',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Try again.',
      })
    }

    const loggedInUser = user as Pick<User, 'id' | 'role' | 'password'>

    // What we will include in the token.
    const payload = prepareTokenPayload(loggedInUser)

    const accessToken = jsonwebtoken.sign(payload, tokenKey, {
      expiresIn,
    })

    return {
      accessToken,
      role: user.role,
    }
  })
