# API Apteka Documentation

## Overview

The API Apteka system provides a complete backend for a pharmacy management system. This document describes all available endpoints, their required parameters, and expected responses.

> **Authorization**
> 
> All endpoints require a valid JWT token in the "Authorization" header, which can be obtained from the /register or /login endpoints.

## Table of Contents

1. [Authentication](#authentication)
   - [Register](#register)
   - [Login](#login)
   - [Me](#me)
2. [Drugs Management](#drugs-management)
   - [List Drugs](#list-drugs)
   - [Get Drug](#get-drug)
   - [Add Drug](#add-drug)
   - [Update Drug](#update-drug)
   - [Remove Drug](#remove-drug)
3. [Orders Management](#orders-management)
   - [Order Drug](#order-drug)
   - [Order History](#order-history)
   - [Order Report](#order-report)

## Authentication

### Register

Creates a new user account.

- **URL**: `/api/v1/register`
- **Method**: `POST`
- **Rate Limit**: 3 requests per 5 minutes
- **Auth Required**: No

**Request Body**:
```json
{
  "name": "String (1-64 chars)",
  "surname": "String (1-64 chars)",
  "email": "String (3-64 chars)",
  "password": "String (8-64 chars)"
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "data": "JWT_TOKEN"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Error message"
}
```

**Notes**:
- This endpoint creates a new user with permission level 0 (client).
- The JWT token expires after 3 hours.
- Email addresses must be unique.

---

### Login

Authenticates an existing user.

- **URL**: `/api/v1/login`
- **Method**: `POST`
- **Rate Limit**: 3 requests per 2 minutes
- **Auth Required**: No

**Request Body**:
```json
{
  "email": "String (3-64 chars)",
  "password": "String (8-64 chars)"
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "data": "JWT_TOKEN"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid email or password."
}
```

**Notes**:
- The JWT token expires after 1 hour.

---

### Me

Returns information about the currently authenticated user.

- **URL**: `/api/v1/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "name": "User's name",
  "surname": "User's surname",
  "email": "User's email"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid Authorization"
}
```

## Drugs Management

### List Drugs

Retrieves a paginated list of all drugs.

- **URL**: `/api/v1/listDrugs`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: All users (0, 1, 2, 3)

**Request Body**:
```json
{
  "page": 0,                   // Optional, default: 0
  "limit": 15,                 // Optional, default: 15
  "filter": [                  // Optional, default: []
    {"fieldName": "value"}     // Example: {"companyName": "Sigma Lek"}
  ],
  "orderBy": "idDrug",         // Optional, default: "idDrug"
  "descending": false          // Optional, default: false
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "metadata": {
    "currentPage": 0,
    "pageCount": 3,
    "results": 15
  },
  "data": [
    {
      "idDrug": 1,
      "name": "Drug name",
      "dose": 2.5,
      "price": 19.99,
      "type": "Type description",
      "companyName": "Manufacturer",
      "amount": 10
    },
    // more drugs...
  ]
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid Authorization"
}
```

---

### Get Drug

Retrieves detailed information about a specific drug.

- **URL**: `/api/v1/getDrug`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permission**: All users (0, 1, 2, 3)

**Query Parameters**:
- `drugId` (required): Integer ID of the drug

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "data": {
    "idDrug": 1,
    "name": "Drug name",
    "dose": 2.5,
    "price": 19.99,
    "type": "Type description",
    "companyName": "Manufacturer",
    "amount": 10
  }
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid drug identification"
}
```

---

### Add Drug

Adds a new drug to the database.

- **URL**: `/api/v1/addDrug`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: Pharmacist only (permission level 2)

**Request Body**:
```json
{
  "name": "String",
  "dose": 2.5,
  "price": 19.99,
  "type": "String",
  "companyName": "String",
  "amount": 10
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "data": {
    "idDrug": 1,
    "name": "Drug name",
    "dose": 2.5,
    "price": 19.99,
    "type": "Type description",
    "companyName": "Manufacturer",
    "amount": 10
  }
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Permission violation"
}
```

---

### Update Drug

Updates an existing drug's information.

- **URL**: `/api/v1/updateDrug`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permission**: Pharmacist only (permission level 2)

**Request Body**:
```json
{
  "drugId": 1,                 // Required
  "name": "New name",          // Optional
  "dose": 5.0,                 // Optional
  "price": 29.99,              // Optional
  "type": "New type",          // Optional
  "companyName": "New company", // Optional
  "amount": 20                 // Optional
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Permission violation"
}
```

---

### Remove Drug

Removes a drug from the database.

- **URL**: `/api/v1/removeDrug`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: Pharmacist only (permission level 2)

**Request Body**:
```json
{
  "drugId": 1
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Permission violation"
}
```

## Orders Management

### Order Drug

Places an order for a drug.

- **URL**: `/api/v1/orderDrug`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: All users (0, 1, 2, 3)

**Request Body**:
```json
{
  "id": 1,       // Drug ID
  "amount": 2.5  // Amount to order
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success"
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid Amount"
}
```

**Notes**:
- The amount requested must be available in inventory.
- The amount cannot be zero.
- The order is recorded in the purchase history with a timestamp.

---

### Order History

Retrieves the authenticated user's order history.

- **URL**: `/api/v1/orderHistory`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: All users (0, 1, 2, 3)

**Request Body**:
```json
{
  "page": 0,                   // Optional, default: 0
  "limit": 15,                 // Optional, default: 15
  "filter": [                  // Optional, default: []
    {"fieldName": "value"}     // Example: {"companyName": "Sigma Lek"}
  ],
  "orderBy": "ph.id",          // Optional, default: "ph.id"
  "descending": true           // Optional, default: false
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "metadata": {
    "currentPage": 0,
    "pageCount": 2,
    "results": 10
  },
  "data": [
    {
      "id": 1,
      "purchase_amount": 2.5,
      "purchase_date": "2023-03-15T14:30:45.123Z",
      "idDrug": 5,
      "drug_name": "Fenistil",
      "dose": 2.0,
      "price": 15.99,
      "type": "Antihistamine",
      "companyName": "Sigma Lek",
      "drug_amount": 25,
      "user_token": "uuid-token",
      "user_name": "John",
      "user_surname": "Doe",
      "user_email": "john.doe@example.com"
    },
    // more orders...
  ]
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Invalid Authorization"
}
```

---

### Order Report

Retrieves a report of all users' orders (for administration).

- **URL**: `/api/v1/orderReport`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permission**: Admin or Pharmacist (permission level > 0)

**Request Body**:
```json
{
  "page": 0,                   // Optional, default: 0
  "limit": 15,                 // Optional, default: 15
  "filter": [                  // Optional, default: []
    {"fieldName": "value"}     // Example: {"companyName": "Sigma Lek"}
  ],
  "orderBy": "ph.id",          // Optional, default: "ph.id"
  "descending": true           // Optional, default: false
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "status": "success",
  "metadata": {
    "currentPage": 0,
    "pageCount": 5,
    "results": 15
  },
  "data": [
    {
      "id": 1,
      "purchase_amount": 2.5,
      "purchase_date": "2023-03-15T14:30:45.123Z",
      "idDrug": 5,
      "drug_name": "Fenistil",
      "dose": 2.0,
      "price": 15.99,
      "type": "Antihistamine",
      "companyName": "Sigma Lek",
      "drug_amount": 25,
      "user_name": "John",
      "user_surname": "Doe", 
      "user_email": "john.doe@example.com"
    },
    // more orders...
  ]
}
```

**Error Response**:
- **Code**: 401
- **Content**:
```json
{
  "status": "error",
  "data": "Permission violation"
}
```

**Notes**:
- Similar to Order History, but displays orders for all users.
- Only accessible to users with permission level greater than 0.

## Development Endpoints

These endpoints are only available when `DEV_CRITICAL` is set to `true` in the environment variables.

### DEV_changePermission

Changes a user's permission level to 2 (Pharmacist).

- **URL**: `/api/v1/DEV_changePermission`
- **Method**: `GET`
- **Query Parameters**:
  - `userId`: The user's token to change permissions for

### DEV_fillData

Populates the database with random drug data.

- **URL**: `/api/v1/DEV_fillData`
- **Method**: `GET`
- **Query Parameters**:
  - `count`: Number of random drugs to generate (default: 20)
