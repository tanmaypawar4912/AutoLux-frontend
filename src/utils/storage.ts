const WISHLIST_KEY = "autolux_wishlist";
export const WISHLIST_EVENT = "autolux-wishlist-updated";

export interface WishlistCar {
  _id: string;
  brand: string;
  model: string;
  image: string;
  price: number;
}

export const getWishlist = (): WishlistCar[] => {
  const data = localStorage.getItem(WISHLIST_KEY);
  return data ? JSON.parse(data) : [];
};

export const isWishlisted = (id: string) => {
  return getWishlist().some((item) => item._id === id);
};

const persistAndNotify = (items: WishlistCar[]) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
};

export const addToWishlist = (car: WishlistCar) => {
  const items = getWishlist();

  if (!items.find((item) => item._id === car._id)) {
    items.push(car);
    persistAndNotify(items);
  }
};

export const removeFromWishlist = (id: string) => {
  const items = getWishlist().filter((car: { _id: string }) => car._id !== id);
  persistAndNotify(items);
};

export const toggleWishlist = (car: { _id: string; brand: string; model: string; image: string; price: number }) => {
  if (isWishlisted(car._id)) {
    removeFromWishlist(car._id);
  } else {
    addToWishlist(car);
  }
};
