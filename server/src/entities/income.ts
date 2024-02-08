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
import { User } from '.'

@Entity()
export class Income {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('decimal')
  amount: number

  @ManyToOne(() => User, (user) => user.incomes)
  @JoinColumn()
  user: User

  @Column('text')
  type: string

  @Column('text', { nullable: true })
  description: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type IncomeBare = Omit<Income, 'user' | 'createdAt' | 'updatedAt'>

export const incomeSchema = validates<IncomeBare>().with({
  id: z.number().int().positive(),
  amount: z.number().positive(),
  type: z.enum(['subscription', 'deposit']),
  description: z.string().nullable(),
})

// When inserting, do not include the id.
export const incomeInsertSchema = incomeSchema
  .omit({
    id: true,
  })
  .extend({
    userEmail: z.string().trim().toLowerCase().email(),
  })

export type IncomeInsert = z.infer<typeof incomeInsertSchema>
