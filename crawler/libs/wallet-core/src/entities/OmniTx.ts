import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('omni_txs')
export class OmniTx {
  @PrimaryColumn()
  public txid: string;

  @Column({ name: 'from_address', nullable: false })
  public fromAddress: string;

  @Column({ name: 'to_address', nullable: false })
  public toAddress: string;

  @Column({ type: 'decimal', precision: 16, scale: 8, nullable: false })
  public amount: string;

  @Column({ type: 'decimal', precision: 16, scale: 8, nullable: false })
  public fee: string;

  @Column({ name: 'property_id', nullable: false })
  public propertyId: number;

  @Column({ name: 'type_int', nullable: false })
  public typeInt: number;

  @Column({ name: 'type', nullable: false })
  public type: string;

  @Column({ name: 'block_number', nullable: false })
  public blockNumber: number;

  @Column({ name: 'block_time', nullable: false })
  public blockTime: number;

  @Column({ name: 'block_hash', nullable: false })
  public blockHash: string;

  @Column({ name: 'valid', nullable: false })
  public valid: boolean;

  @Column({ name: 'divisible', nullable: false })
  public divisible: boolean;
}
