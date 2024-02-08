import type { User, UserRoleType } from '@server/entities/user'
import { random } from '@tests/utils/random'
import { Income, MaterialLoan, Relative, Material, Penalty } from '..'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  firstName: 'eyob',
  lastName: 'zebene',
  role: 'user',
  age: 23,
  profileImage:
    'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
  isVerified: false,
  ...overrides,
})

export const fakeAdmin = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'admin123!',
  firstName: 'balcha',
  lastName: 'debele',
  role: 'admin' as UserRoleType,
  age: 23,
  profileImage:
    'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
  isVerified: true,
  ...overrides,
})

export const fakeRelative = <T extends Partial<Relative>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})

export const fakeMaterial = <T extends Partial<Material>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})

export const fakeIncome = <T extends Partial<Income>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})

export const fakeMaterialLoan = <T extends Partial<MaterialLoan>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})

export const fakeExpense = <T extends Partial<Income>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})

export const fakePenalty = <T extends Partial<Penalty>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  ...overrides,
})
