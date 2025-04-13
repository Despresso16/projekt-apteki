import {ajv} from "../index.js";

export const registerSchema = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 3,
            maxLength: 64
        },
        name: {
            type: "string",
            minLength: 1,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 1,
            maxLength: 64,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 64,
        },
    },
    required: ["email", "name", "surname", "password"],
    additionalProperties: false
});

export const loginSchema = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 3,
            maxLength: 64
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 64,
        },
    },
    required: ["email", "password"],
    additionalProperties: false
});

export const drugSchema = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 64,
        },
        dose: { type: "number" },
        price: { type: "number" },
        type: { type: "string" },
        companyName: { type: "string" },
        amount: { type: "integer" },
    },
    required: ["name", "dose", "price", "type", "companyName", "amount"],
    additionalProperties: false
});

export const updateDrugSchema = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 64,
        },
        dose: { type: "number" },
        price: { type: "number" },
        type: { type: "string" },
        companyName: { type: "string" },
        amount: { type: "integer" },
        drugId: { type: "integer"}
    },
    required: ["drugId"],
    additionalProperties: false
});

export const orderSchema = ajv.compile({
    type: "object",
    properties: {
        id: { type: "integer" },
        amount: { type: "number" },
    },
    required: ["id", "amount"],
    additionalProperties: false
});