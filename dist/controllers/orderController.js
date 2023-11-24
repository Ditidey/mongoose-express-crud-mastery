"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalPrice = exports.listOrders = exports.addOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const users_1 = __importDefault(require("../models/users"));
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const schema = joi_1.default.object({
        productName: joi_1.default.string().required(),
        price: joi_1.default.number().required(),
        quantity: joi_1.default.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: {
                code: 400,
                description: error.details[0].message,
            },
        });
    }
    try {
        const user = yield users_1.default.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        if (!user.orders) {
            user.orders = [];
        }
        user.orders.push(req.body);
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Order created successfully!',
            data: null,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: {
                code: 500,
                description: 'Internal Server Error',
            },
        });
    }
});
exports.addOrder = addOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        const orders = user.orders || [];
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully!',
            data: {
                orders,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: {
                code: 500,
                description: 'Internal Server Error',
            },
        });
    }
});
exports.listOrders = listOrders;
const calculateTotalPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found!',
                },
            });
        }
        const orders = user.orders || [];
        const totalPrice = orders.reduce((total, order) => total + order.price * order.quantity, 0);
        res.status(200).json({
            success: true,
            message: 'Total price calculated successfully!',
            data: {
                totalPrice,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: {
                code: 500,
                description: 'Internal Server Error',
            },
        });
    }
});
exports.calculateTotalPrice = calculateTotalPrice;
