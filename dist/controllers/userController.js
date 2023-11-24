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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.listUsers = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const users_1 = __importDefault(require("../models/users"));
const saltRounds = 10;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validating request body
    const schema = joi_1.default.object({
        userId: joi_1.default.number().required(),
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        fullName: joi_1.default.object({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
        }),
        age: joi_1.default.number().required(),
        email: joi_1.default.string().email().required(),
        isActive: joi_1.default.boolean(),
        hobbies: joi_1.default.array().items(joi_1.default.string()),
        address: joi_1.default.object({
            street: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
        }),
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
    // Hashing password before saving to the database
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
    try {
        const user = new users_1.default(req.body);
        yield user.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: {
                userId: user.userId,
                username: user.username,
                fullName: user.fullName,
                age: user.age,
                email: user.email,
                isActive: user.isActive,
                hobbies: user.hobbies,
                address: user.address,
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
exports.createUser = createUser;
// Implementing user controller functions (listUsers, getUserById, updateUser, deleteUser)
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.default.find({}, { password: 0 });
        const userData = users.map((user) => ({
            userId: user.userId,
            username: user.username,
            fullName: user.fullName,
            age: user.age,
            email: user.email,
            address: user.address,
        }));
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully!',
            data: userData,
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
exports.listUsers = listUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findOne({ userId: req.params.userId }, { password: 0 });
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
        res.status(200).json({
            success: true,
            message: 'User fetched successfully!',
            data: {
                userId: user.userId,
                username: user.username,
                fullName: user.fullName,
                age: user.age,
                email: user.email,
                isActive: user.isActive,
                hobbies: user.hobbies,
                address: user.address,
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
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validating request body
    const schema = joi_1.default.object({
        userId: joi_1.default.number().required(),
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        fullName: joi_1.default.object({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
        }),
        age: joi_1.default.number().required(),
        email: joi_1.default.string().email().required(),
        isActive: joi_1.default.boolean(),
        hobbies: joi_1.default.array().items(joi_1.default.string()),
        address: joi_1.default.object({
            street: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
        }),
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
    // Hashing password before saving to the database
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
    try {
        const user = yield users_1.default.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true, projection: { password: 0 } });
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
        res.status(200).json({
            success: true,
            message: 'User updated successfully!',
            data: {
                userId: user.userId,
                username: user.username,
                fullName: user.fullName,
                age: user.age,
                email: user.email,
                isActive: user.isActive,
                hobbies: user.hobbies,
                address: user.address,
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
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findOneAndDelete({ userId: req.params.userId });
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
        res.status(200).json({
            success: true,
            message: 'User deleted successfully!',
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
exports.deleteUser = deleteUser;
