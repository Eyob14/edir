import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { User, Material } from '.'

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('decimal')
  amount: number

  @ManyToOne(() => User, (user) => user.incomes)
  @JoinColumn()
  user: User

  @ManyToOne(() => Material, (material) => material.expenses)
  @JoinColumn()
  material: Material

  @Column('text')
  type: string

  @Column('text')
  reason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type ExpenseBare = Omit<
  Expense,
  'user' | 'material' | 'createdAt' | 'updatedAt'
>

export const expenseSchema = validates<ExpenseBare>().with({
  id: z.number().int().positive(),
  amount: z.number().positive(),
  type: z.enum(['member payment', 'material cost']),
  reason: z.string().min(2),
})

// When inserting, do not include the id.
export const expenseInsertSchema = expenseSchema
  .omit({
    id: true,
  })
  .extend({
    userEmail: z.string().trim().toLowerCase().email().nullable(),
    materialName: z.string().trim().toLowerCase().nullable(),
  })

export type ExpenseInsert = z.infer<typeof expenseInsertSchema>
