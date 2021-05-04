export enum UserTier {
  Start = 'RedKite' ,
  Bronze = 'Hawk',
  Silver = 'Falcon',
  Gold = 'Eagle',
  Diamond = 'Phoenix'
}

export type userTiers = Extract<UserTier, 
  UserTier.Diamond | 
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
  4: { 
    text: UserTier.Diamond,
    icon: '/images/icons/diamond.svg'
  }
}

export const getUserTierAlias = (tier: number) => {
  return userTierByNumber[tier];
}
