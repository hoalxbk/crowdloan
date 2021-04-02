import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('zec_txs')
export class ZecTx {
  @PrimaryColumn()
  public txid: string;

  @Column({ type: 'decimal', precision: 16, scale: 8, nullable: false })
  public fee: number;

  @Column({ nullable: false })
  public block_number: number;

  @Column({ nullable: false })
  public block_time: number;

  @Column({ nullable: false })
  public block_hash: string;
}
