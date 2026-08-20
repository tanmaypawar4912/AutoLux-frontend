const WISHLIST_KEY = "autolux_wishlist";

export const WISHLIST_EVENT =
  "autolux-wishlist-updated";

// ======================================
// WISHLIST CAR
// ======================================

export interface WishlistCar {
  _id: string;
  brand: string;
  model: string;
  image: string;
  price: number;
}

// ======================================
// GET LOCAL WISHLIST
// ======================================

export const getWishlist = (): WishlistCar[] => {
  try {
    const data =
      localStorage.getItem(WISHLIST_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as WishlistCar[];
  } catch (error) {
    console.error(
      "Get Wishlist Storage Error:",
      error
    );

    return [];
  }
};

// ======================================
// CHECK WISHLIST
// ======================================

export const isWishlisted = (
  id: string
): boolean => {
  return getWishlist().some(
    (item) => item._id === id
  );
};

// ======================================
// SAVE LOCAL CACHE
// ======================================

const persistAndNotify = (
  items: WishlistCar[]
) => {
  try {
    localStorage.setItem(
      WISHLIST_KEY,
      JSON.stringify(items)
    );

    window.dispatchEvent(
      new Event(WISHLIST_EVENT)
    );
  } catch (error) {
    console.error(
      "Save Wishlist Storage Error:",
      error
    );
  }
};

// ======================================
// REPLACE LOCAL WISHLIST
// MongoDB -> Local UI Cache
// ======================================

export const replaceWishlist = (
  items: WishlistCar[]
) => {
  persistAndNotify(items);
};

// ======================================
// ADD TO LOCAL CACHE
// ======================================

export const addToWishlist = (
  car: WishlistCar
) => {
  const items = getWishlist();

  const exists = items.some(
    (item) =>
      item._id === car._id
  );

  if (!exists) {
    persistAndNotify([
      ...items,
      car,
    ]);
  }
};

// ======================================
// REMOVE FROM LOCAL CACHE
// ======================================

export const removeFromWishlist = (
  id: string
) => {
  const items =
    getWishlist().filter(
      (car) =>
        car._id !== id
    );

  persistAndNotify(items);
};

// ======================================
// CLEAR WISHLIST
// IMPORTANT:
// Called on logout / signed-out state
// ======================================

export const clearWishlist = () => {
  try {
    localStorage.removeItem(
      WISHLIST_KEY
    );

    window.dispatchEvent(
      new Event(WISHLIST_EVENT)
    );
  } catch (error) {
    console.error(
      "Clear Wishlist Storage Error:",
      error
    );
  }
};

// ======================================
// LEGACY TOGGLE
// Keep this because other components
// may still import it.
// ======================================

export const toggleWishlist = (
  car: WishlistCar
) => {
  if (
    isWishlisted(car._id)
  ) {
    removeFromWishlist(
      car._id
    );
  } else {
    addToWishlist(car);
  }
};