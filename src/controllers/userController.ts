import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import UserModel from '../models/users';

const saltRounds = 10;

export const createUser = async (req: Request, res: Response) => {
  // Validating request body
  const schema = Joi.object({
    userId: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullName: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    isActive: Joi.boolean(),
    hobbies: Joi.array().items(Joi.string()),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
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
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  req.body.password = hashedPassword;

  try {
    const user = new UserModel(req.body);
    await user.save();
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
  } catch (err) {
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
};

// Implementing user controller functions (listUsers, getUserById, updateUser, deleteUser)
export const listUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find({}, { password: 0 });
  
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
    } catch (err) {
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
  };
  
  export const getUserById = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ userId: req.params.userId }, { password: 0 });
  
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
    } catch (err) {
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
  };
  
  export const updateUser = async (req: Request, res: Response) => {
    // Validating request body
    const schema = Joi.object({
      userId: Joi.number().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      fullName: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
      }),
      age: Joi.number().required(),
      email: Joi.string().email().required(),
      isActive: Joi.boolean(),
      hobbies: Joi.array().items(Joi.string()),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
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
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
  
    try {
      const user = await UserModel.findOneAndUpdate(
        { userId: req.params.userId },
        req.body,
        { new: true, projection: { password: 0 } }
      );
  
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
    } catch (err) {
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
  };
  
  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOneAndDelete({ userId: req.params.userId });
  
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
    } catch (err) {
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
  };

