import { ZecTx } from '../entities';
import { getRepository } from 'typeorm';

export async function getLatestCrawledZecBlockNumber(): Promise<number> {
  const lastTx = await getRepository(ZecTx).findOne({ order: { block_number: 'DESC' } });
  if (!lastTx) {
    return 0;
  }

  return lastTx.block_number;
}

export default getLatestCrawledZecBlockNumber;
