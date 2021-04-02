import { Index, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('contract_logs')
export class ContractLog {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { name: 'contract_name', nullable: false })
  public contractName: string;

  @Column('varchar', { name: 'event', nullable: false })
  public event: string;

  @Column('text', { name: 'return_values', nullable: false })
  public returnValues: string;

  @Column('varchar', { name: 'from', nullable: false })
  public from: string;

  @Column('varchar', { name: 'to', nullable: false })
  public to: string;

  @Column('varchar', { name: 'value', nullable: false })
  public value: string;

  @Column({ name: 'block_number', nullable: false })
  public blockNumber: number;

  @Column('varchar', { name: 'block_hash', nullable: false })
  public blockHash: string;

  @Column('varchar', { name: 'transaction_hash', nullable: false })
  public transactionHash: string;

  @Column('varchar', { name: 'transaction_from', nullable: false })
  public transactionFrom: string;

  @Column('varchar', { name: 'transaction_to', nullable: false })
  public transactionTo: string;

  @Column('varchar', { name: 'transaction_value', nullable: false })
  public transactionValue: string;

  @Column({ name: 'gas', type: 'bigint' })
  public gas: number;

  @Column({ name: 'gas_price', type: 'bigint' })
  public gasPrice: number;

  @Column({ name: 'gas_used', type: 'bigint' })
  public gasUsed: number;

  @Column({ name: 'created_at', type: 'bigint' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = Utils.nowInMillis();
    this.updatedAt = Utils.nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = Utils.nowInMillis();
  }
}
