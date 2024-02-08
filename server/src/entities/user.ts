import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { Relative } from './relative'
import { Income } from './income'
import { Expense, MaterialLoan } from '.'

export type UserRoleType = 'admin' | 'user'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text', { select: false })
  password: string

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: UserRoleType

  @Column('int')
  age: number

  @Column('boolean', { default: false })
  isVerified: boolean

  @Column('text')
  profileImage: string

  @OneToMany(() => Expense, (expense) => expense.user, {
    cascade: ['insert'],
  })
  expenses: Expense[]

  @OneToMany(() => Relative, (relative) => relative.user, {
    cascade: ['insert'],
  })
  relatives: Relative[]

  @OneToMany(() => Income, (income) => income.user, {
    cascade: ['insert'],
  })
  incomes: Income[]


  @OneToMany(() => MaterialLoan, (materialLoan) => materialLoan.user, {
    cascade: ['insert'],
  })
  materialLoans: MaterialLoan[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type UserBare = Omit<
  User,
  | 'projects'
  | 'relatives'
  | 'incomes'
  | 'expenses'
  | 'materialLoans'
  | 'createdAt'
  | 'updatedAt'
>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(64),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  age: z.number().int().positive(),
  role: z.enum(['admin', 'user']),
  isVerified: z.boolean(),
  profileImage: z.string().url(),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id' | 'role'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
  role: z.enum(['admin', 'user']),
})
