const RECENTLY_VIEWED_KEY = "recently_viewed_cars";
const MAX_ITEMS = 10;

export const getRecentlyViewed = (): string[] => {
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (carId: string): void => {
  const current = getRecentlyViewed().filter((id) => id !== carId);
  const next = [carId, ...current].slice(0, MAX_ITEMS);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
};
