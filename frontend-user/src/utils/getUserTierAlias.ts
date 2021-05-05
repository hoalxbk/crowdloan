export enum UserTier {
  Start = 'RedKite' ,
  Bronze = 'Falcon',
  Silver = 'Eagle',
  Gold = 'Phoenix',
}

export type userTiers = Extract<UserTier, 
  UserTier.Gold | 
  UserTier.Silver | 
  UserTier.Bronze |
  UserTier.Start
>

export const userTierByNumber: { [key: number]: { text: userTiers, icon?: string } } = {
  0: { 
    text: UserTier.Start,
    icon: '/images/icons/rocket.svg'
  },
  1: { 
    text: UserTier.Bronze,
    icon: '/images/icons/bronze-medal.svg'
  },
  2: { 
    text: UserTier.Silver,
    icon: '/images/icons/silver-medal.svg',
  },
  3: { 
    text: UserTier.Gold,
    icon: '/images/icons/golden-medal.svg'
  },
}

export const getUserTierAlias = (tier: number) => {
  return userTierByNumber[tier];
}
