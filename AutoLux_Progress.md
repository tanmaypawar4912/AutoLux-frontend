# AutoLux Car Dealership — Project Progress Tracker

**Project:** AutoLux / Car Dealership Website  
**Stack:** React + TypeScript + Tailwind CSS + Node.js + Express + MongoDB + Clerk + Cloudinary  
**Current stage:** Admin + Dynamic Car Management / Filtering / Edit flow

---

# 1. Project Foundation

## Frontend
- React + TypeScript project created.
- React Router configured.
- Tailwind CSS used for UI.
- Clerk authentication integrated.
- Public and protected routes created.

## Backend
- Node.js + Express backend created.
- MongoDB + Mongoose connected.
- REST API structure created.
- Car APIs created.
- Admin middleware implemented.
- Cloudinary used for car images.

---

# 2. Authentication & Protected Routes

Implemented:
- Clerk authentication.
- Protected user routes.
- Protected admin routes.
- User synchronization with MongoDB.
- Admin dashboard protection.

Routes include:

```text
/
 /cars
 /cars/:id
 /sell
 /my-cars
 /edit-car/:id
 /my-bookings
 /wishlist
 /compare
 /sell/estimate

/admin
/admin/cars
/admin/users
/admin/bookings
/admin/wishlist
/admin/reviews
/admin/enquiries
/admin/settings
```

---

# 3. Main Website Pages

Implemented major pages:

- Home
- Buy Cars
- Car Details
- About
- Contact
- Sell Car
- My Cars
- Edit Car
- My Bookings
- Wishlist
- Compare
- Valuation
- Admin Dashboard
- Admin Cars
- Admin Users
- Admin Bookings
- Admin Wishlist
- Admin Reviews
- Admin Enquiries
- Admin Settings
- 404 page

---

# 4. Car Database / Schema

The Car schema was expanded from the original basic fields.

## Seller Information
- sellerName
- sellerEmail

## Basic Car Information
- brand
- model
- year
- price
- kilometers
- fuelType
- transmission
- description

## Dynamic Filter Information
- bodyType
- color
- seats
- owners
- hub
- availability
- carCategory

## Features
- safetyFeatures[]
- features[]

## Images
- old `image` field retained for compatibility
- new four-image structure:
  - front
  - back
  - left
  - right

## Other
- city
- views
- status
- addedBy
- featured
- stock
- createdAt
- updatedAt

---

# 5. Admin Settings — Dynamic Options

Admin Settings was made dynamic so the admin can manage car options from MongoDB.

Dynamic categories include:

- Fuel Types
- Transmissions
- Body Types
- Colors
- Seats
- Owners
- Hubs
- Availability
- Car Categories
- Safety Features
- Features

The Buy Cars and Sell Car areas use these dynamic values instead of relying only on hard-coded options.

---

# 6. Sell Car Form

Sell Car was upgraded to collect more complete vehicle information.

Added / supported:

- Brand
- Model
- Year
- Price
- Kilometers
- Fuel Type
- Transmission
- Body Type
- Color
- Seats
- Previous Owners
- Car Category
- Hub
- City
- Safety Features
- Car Features
- Description
- Car images

## UI decisions

- Existing UI/design was preserved.
- Availability was removed from the seller form as requested.
- Features use checkboxes.
- Safety Features use checkboxes.
- Form layout was adjusted:
  - Previous Owners beside Car Category
  - Hub beside City

---

# 7. Admin Add Car

Admin Add Car was updated to support the expanded Car schema.

Admin can work with:

- Seats
- Owners
- Body Type
- Color
- Hub
- Car Category
- Safety Features
- Features
- Featured
- Stock
- Dynamic options

Existing admin UI was preserved as much as possible.

---

# 8. Buy Cars — Dynamic Filters

Buy Cars has dynamic filters connected to Admin Settings / MongoDB.

Implemented / worked on:

- Brand
- Fuel Type
- Transmission
- Year
- Kilometers
- City
- Body Type
- Color
- Seats
- Owners
- Hub
- Availability
- Car Category
- Safety Features
- Features

## Kilometers
Kms filter uses ranges such as:

- Under 10,000 km
- 10,000–30,000 km
- 30,000–60,000 km
- 60,000–1,00,000 km
- 1,00,000+ km

The working Kms functionality was intentionally preserved during later changes.

---

# 9. Filter Scroll Behaviour

A major issue was page scrolling after filter / pagination clicks.

Required behaviour:

> When a filter or pagination button is clicked, page should scroll to the top.

This was fixed while trying to preserve the existing filter functionality.

Important rule established:

**Do not disturb working filters while changing scroll behaviour.**

---

# 10. Search Cars

Search Cars was made dynamic.

Goal:

- Dynamic Brand values
- Dynamic Model values
- Values should come from actual MongoDB-loaded cars.
- Search should work with actual car brand/model data.

The search was changed to work with:

```text
car.brand
car.name / model mapping
```

Multi-word searches such as:

```text
BMW M4
Mercedes GLC
```

are intended to work.

A dynamic Brand/Model suggestion system was also worked on.

---

# 11. Wishlist / Recently Viewed / Browse Brands

Existing functionality includes:

- Personal wishlist
- Wishlist loading from backend
- Recently viewed cars
- Browse Brands
- Dynamic car loading

Buy Cars successfully loaded approved cars.

At one point logs showed:

```text
Approved Cars Loaded: 67
Dynamic Fuel Types Loaded: 6
Dynamic Transmissions Loaded: 5
Dynamic Car Options Loaded: 39
```

This confirmed that the dynamic backend data was reaching the frontend.

---

# 12. Admin Sidebar

Admin Sidebar was completed.

Existing sidebar sections:

- Dashboard
- Cars
- Bookings
- Users
- Wishlist
- Reviews
- Enquiries
- Settings

## Final change

The old:

```text
Logout
```

button was replaced with:

```text
Go to Home
```

Behaviour:

```text
Admin Dashboard → Go to Home → /
```

The existing sidebar UI and navigation were preserved.

---

# 13. Admin Cars — Edit Car Issue

An important issue was found:

### Symptom

Admin Edit Car showed:

```text
Car updated successfully
```

but:

- MongoDB data was not changing correctly.
- Dashboard continued showing old values.

---

# 14. Investigation of Edit Car

Frontend was checked.

The existing frontend already used:

```text
PUT /api/cars/:id
```

and refreshed the cars list after success.

Therefore the main issue was identified in the backend controller.

---

# 15. Backend Car Update Problem

The `carRoutes.js` route was already correct:

```js
router.put(
  "/:id",
  adminMiddleware,
  updateCar
);
```

The problem was inside `carController.js`.

The original `allowedFields` list did not contain the newer fields.

It supported older fields such as:

- sellerName
- sellerEmail
- brand
- model
- year
- price
- kilometers
- fuelType
- transmission
- description
- image
- images
- city
- status
- featured
- stock

But newer fields were missing.

---

# 16. Corrected Update Fields

The corrected update logic supports:

```text
sellerName
sellerEmail
brand
model
year
price
kilometers
fuelType
transmission
bodyType
color
seats
owners
hub
availability
carCategory
safetyFeatures
features
description
image
images
city
status
featured
stock
```

The update uses MongoDB:

```js
Car.findByIdAndUpdate(
  id,
  { $set: updateData },
  {
    new: true,
    runValidators: true,
  }
);
```

---

# 17. Duplicate updateCar Error

While applying the backend fix, `updateCar` accidentally existed twice inside `carController.js`.

This caused:

```text
SyntaxError:
Identifier 'updateCar' has already been declared
```

This also caused the backend to crash.

Because the backend was down, frontend requests returned:

```text
ERR_CONNECTION_REFUSED
```

including:

```text
/api/options/transmissions
/api/options/fuel-types
/api/options/car-options
```

The duplicate `updateCar` function was removed while preserving the corrected version.

---

# 18. Current Backend Status

A corrected:

```text
carController.js
```

was prepared with:

- Single `updateCar` function
- Expanded allowed fields
- Number handling
- Boolean handling
- Array handling
- Status validation
- MongoDB update
- Updated car response

The corrected controller file was generated separately.

---

# 19. Important Errors Solved During Project

## Backend connection error

```text
ERR_CONNECTION_REFUSED
```

Cause:
- Backend server was not running / had crashed.

## Duplicate updateCar

```text
Identifier 'updateCar' has already been declared
```

Cause:
- Duplicate function declaration in `carController.js`.

## Dynamic options fetch errors

```text
/api/options/transmissions
/api/options/fuel-types
/api/options/car-options
```

Cause:
- Backend unavailable after crash.

## Sell Car error

```text
FEATURE_OPTIONS is not defined
```

Cause:
- Missing feature options variable in Sell Car.

## Buy Car Sidebar errors

```text
Cannot read properties of undefined (reading 'filter')
```

and:

```text
kilometerRanges is not defined
```

These were related to Sidebar props / dynamic filter integration.

---

# 20. Clerk Warnings

Clerk development-key warning appeared:

```text
Clerk has been loaded with development keys.
```

This is a development environment warning, not the cause of the car update issue.

There was also a deprecated:

```text
redirectUrl
```

warning, where Clerk recommends:

```text
fallbackRedirectUrl
```

or:

```text
forceRedirectUrl
```

---

# 21. Current Project State

## Completed / Working

- [x] React frontend
- [x] Express backend
- [x] MongoDB
- [x] Clerk authentication
- [x] Admin protection
- [x] Car CRUD foundation
- [x] Dynamic Admin Settings
- [x] Dynamic car options
- [x] Expanded Car schema
- [x] Sell Car expanded form
- [x] Admin Add Car expanded fields
- [x] Buy Cars dynamic filters
- [x] Kms filter
- [x] Safety Features
- [x] Car Features
- [x] Dynamic search work
- [x] Admin Sidebar
- [x] Go to Home button
- [x] Edit Car backend update logic prepared
- [x] Duplicate updateCar issue identified/fixed

---

# 22. Current Pending Verification

The next thing to verify is:

## Admin Edit Car → MongoDB

Test:

```text
Admin Dashboard
      ↓
Cars
      ↓
Edit
      ↓
Change Model / Price / Color / Seats etc.
      ↓
Save
      ↓
MongoDB
      ↓
Refresh Admin Cars
```

Expected:

```text
Updated values should appear in:
1. MongoDB
2. Admin Cars list
3. Dashboard / relevant car views
```

---

# 23. Rules for Future Changes

These became important during the project:

### Rule 1
**Do not change existing working UI unnecessarily.**

### Rule 2
If one functionality is already working, only modify the specific requested part.

### Rule 3
Before changing Buy Cars filters, preserve:

- Kms
- Safety
- Features
- Pagination
- Scroll-to-top
- Dynamic options

### Rule 4
Before changing Search Cars, do not touch filter logic.

### Rule 5
Before changing Admin Cars, do not disturb:

- Add Car
- Delete
- Approve/Reject
- Featured
- Stock
- Dynamic options
- Existing UI

### Rule 6
Backend changes should be isolated to the required API/controller.

---

# 24. Recommended Next Step

### Priority 1
Verify the corrected backend:

```bash
npm run dev
```

Make sure there is no:

```text
Identifier 'updateCar' has already been declared
```

### Priority 2
Test Admin Edit Car.

### Priority 3
Check MongoDB after editing:

```text
brand
model
price
color
seats
owners
bodyType
features
safetyFeatures
```

### Priority 4
Only after Edit Car is confirmed, continue with the next project feature.

---

# Project Progress Summary

The project has progressed from a basic React car website into a much more complete dealership platform with:

```text
Authentication
      ↓
User Features
      ↓
Car Selling
      ↓
Admin Management
      ↓
Dynamic Options
      ↓
Dynamic Filters
      ↓
Search
      ↓
Wishlist / Compare / Recently Viewed
      ↓
Admin Car Management
      ↓
MongoDB-backed Car Editing
```

**Current focus:** Finish verification of the Admin Edit Car → MongoDB update flow without disturbing existing working functionality.
