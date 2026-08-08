const COMPARE_KEY = "car_compare_list";
export const COMPARE_EVENT = "compare-updated";
export const MAX_COMPARE = 3;

export const getCompareList = (): string[] => {
  try {
    const saved = localStorage.getItem(COMPARE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isInCompare = (carId: string): boolean => getCompareList().includes(carId);

// returns { list, wasAdded } so the caller can show a "max 3" message if needed
export const toggleCompare = (carId: string): { list: string[]; wasAdded: boolean } => {
  const current = getCompareList();

  if (current.includes(carId)) {
    const next = current.filter((id) => id !== carId);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(COMPARE_EVENT));
    return { list: next, wasAdded: false };
  }

  if (current.length >= MAX_COMPARE) {
    return { list: current, wasAdded: false };
  }

  const next = [...current, carId];
  localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(COMPARE_EVENT));
  return { list: next, wasAdded: true };
};

export const removeFromCompare = (carId: string): string[] => {
  const next = getCompareList().filter((id) => id !== carId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(COMPARE_EVENT));
  return next;
};

export const clearCompare = (): void => {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event(COMPARE_EVENT));
};
