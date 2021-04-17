export enum UserTier {
  Start = 'Start' ,
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Diamond = 'Diamond'
}

export type userTiers = Extract<UserTier, 
  UserTier.Diamond | 
  UserTier.Gold | 
  UserTier.Silver | 
  UserTier.Bronze |
  UserTier.Start
>

export const userTierByNumber: { [key: number]: userTiers } = {
  0: UserTier.Start,
  1: UserTier.Bronze,
  2: UserTier.Silver,
  3: UserTier.Gold,
  4: UserTier.Diamond
}

export const getUserTierAlias = (tier: number) => {
  return userTierByNumber[tier];
}
