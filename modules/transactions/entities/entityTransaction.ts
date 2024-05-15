import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { IsString, IsOptional, IsInt, IsIn, IsNumber } from "class-validator";
import { Payable } from "../../Payable/entitiy/entityPayable";

export enum PaymentMethod {
  PIX = "pix",
  CREDIT_CARD = "credit_card",
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @IsInt()
  amount: number;

  @Column()
  @IsString()
  description: string;

  @OneToMany(() => Payable, (payable) => payable.transaction)
  payables: Payable[];

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  @IsIn([PaymentMethod.PIX, PaymentMethod.CREDIT_CARD])
  method: PaymentMethod;

  @Column()
  @IsString()
  name: string;

  @Column("bigint")
  @IsNumber()
  cpf: number;

  @Column("bigint", { nullable: true })
  @IsOptional()
  @IsString()
  card_number?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsInt()
  valid?: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsInt()
  cvv?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
