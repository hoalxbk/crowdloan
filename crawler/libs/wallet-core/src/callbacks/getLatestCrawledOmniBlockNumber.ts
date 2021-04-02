import { OmniTx } from '../entities';
import { getRepository } from 'typeorm';

export async function getLatestCrawledOmniBlockNumber(): Promise<number> {
  const lastTx = await getRepository(OmniTx).findOne({ order: { blockNumber: 'DESC' } });
  if (!lastTx) {
    return 0;
  }

  return lastTx.blockNumber;
}

export default getLatestCrawledOmniBlockNumber;
