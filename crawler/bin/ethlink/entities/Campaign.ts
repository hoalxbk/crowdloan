import { Index, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'title', nullable: false })
  public title: string;

  @Column('varchar', { name: 'token', nullable: true })
  public token: string;

  @Column('varchar', { name: 'registed_by', nullable: true })
  public registedBy: string;

  @Column('varchar', { name: 'campaign_hash', nullable: true })
  public campaignHash: string;

  @Column({ name: 'campaign_id', nullable: true })
  public campaignId: number;

  @Column('varchar', { name: 'funding_wallet_address', nullable: true })
  public fundingWalletAddress: string;

  @Column({ name: 'affiliate' })
  public affiliate: boolean;

  @Column({ name: 'start_time', type: 'bigint' })
  public startTime: number;

  @Column({ name: 'finish_time', type: 'bigint' })
  public finishTime: number;

  @Column('varchar', { name: 'token_conversion_rate', nullable: true })
  public tokenConversionRate: string;

  @Column('varchar', { name: 'ether_conversion_rate', nullable: true })
  public etherConversionRate: string;

  @Column({ name: 'decimals', type: 'bigint' })
  public decimals: number;

  @Column('varchar', { name: 'name', nullable: true })
  public name: string;

  @Column('varchar', { name: 'symbol', nullable: true })
  public symbol: string;

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
