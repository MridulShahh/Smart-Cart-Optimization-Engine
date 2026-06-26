# Smart Cart Optimization Engine - API Documentation

## Base URL

http://localhost:8000

---

# Product APIs

## Get All Products

GET /api/products

Example:
GET http://localhost:8000/api/products

---

## Get Product By ID

GET /api/products/:id

Example:
GET http://localhost:8000/api/products/PRODUCT_ID

---

## Create Product

POST /api/products

Sample Request Body:

{
  "name": "Laptop",
  "category": "Electronics",
  "price": 65000,
  "rating": 4.5,
  "popularity": 90,
  "stock": 10,
  "description": "Gaming Laptop",
  "tags": ["computer", "work"]
}

---

## Update Product

PUT /api/products/:id

---

## Delete Product

DELETE /api/products/:id

---

# Cart APIs

## Get Cart

GET /api/cart/:userId

Example:
GET http://localhost:8000/api/cart/user1

---

## Add To Cart

POST /api/cart/:userId/add

Sample Request Body:

{
  "productId": "PRODUCT_ID",
  "quantity": 1
}

---

## Update Cart Item

PUT /api/cart/:userId/update

Sample Request Body:

{
  "productId": "PRODUCT_ID",
  "quantity": 2
}

---

## Remove Cart Item

DELETE /api/cart/:userId/remove/:productId

---

## Clear Cart

DELETE /api/cart/:userId/clear

---

# Recommendation API

## Get Recommendations

GET /api/recommendations/:userId

Example:
GET http://localhost:8000/api/recommendations/user1

Description:
Returns top recommended products based on:
- Product Relationship
- Popularity
- Rating
- Price Compatibility

---

# Current Sample Products

- Laptop
- Wireless Mouse
- Mechanical Keyboard
- Laptop Bag

---