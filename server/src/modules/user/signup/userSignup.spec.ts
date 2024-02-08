import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import usersRouter from '..'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const { signup } = usersRouter.createCaller({ db })

it('should save a user', async () => {
  const user = fakeUser()
  const response = await signup(user)

  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
      age: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      isVerified: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password' | 'age' | 'firstName' | 'lastName' | 'profileImage' | 'role' | 'isVerified'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    profileImage: user.profileImage,
    role: user.role,
    isVerified: false,
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
  })

  expect(response.id).toEqual(userCreated!.id)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      email: 'user-email-invalid',
      password: 'password.123',
      age: 24,
      firstName: 'John',
      lastName: 'Doe',
      profileImage:
        'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    })
  ).rejects.toThrow(/email/i) // throws out some error complaining about "email"
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup({
      email: 'user2@domain.com',
      password: 'pas.123',
      age: 24,
      firstName: 'John',
      lastName: 'Doe',
      profileImage:
        'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    })
  ).rejects.toThrow(/password/i) // throws out some error complaining about "password"
})

it('throws an error for invalid email', async () => {
  await expect(
    signup({
      email: 'not-an-email',
      password: 'some-password',
      age: 24,
      firstName: 'John',
      lastName: 'Doe',
      profileImage:
        'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    })
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: ` \t ${user.email}\t `, // tabs and spaces
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
