const DAILY_REWARDS = [
  { coins: 25 },
  { coins: 30 },
  { coins: 40 },
  { coins: 50 },
  { coins: 65 },
  { coins: 80 },
  { coins: 100, premium: 1 }
];

export function claimDailyReward(save, { calendarDay }) {
  const dailyReward = save.dailyReward ?? { streak: 0, lastClaimDay: null };

  if (dailyReward.lastClaimDay === calendarDay) {
    return { ok: false, reason: 'already_claimed_today', save };
  }

  const nextStreak = dailyReward.streak + 1;
  const reward = DAILY_REWARDS[(nextStreak - 1) % DAILY_REWARDS.length];

  return {
    ok: true,
    reward,
    save: {
      ...save,
      coins: (save.coins ?? 0) + (reward.coins ?? 0),
      premium: (save.premium ?? 0) + (reward.premium ?? 0),
      dailyReward: {
        streak: nextStreak,
        lastClaimDay: calendarDay
      }
    }
  };
}
