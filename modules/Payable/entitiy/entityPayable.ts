import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Transaction } from "../../transactions/entities/entityTransaction";

export enum payableStatus {
  PAID = "paid",
  WAITING_FUNDS = "waiting_funds",
}

@Entity()
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.payables)
  transaction: Transaction;

  @Column({
    type: "enum",
    enum: payableStatus,
  })
  status: payableStatus;

  @Column()
  payment_date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  fee: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
