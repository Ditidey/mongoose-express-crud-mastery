import { Request, Response } from 'express';
import Joi from 'joi';
import UserModel from '../models/users';
import OrderModel from '../models/orders';

export const addOrder = async (req: Request, res: Response) => {
  // Validate request body
  const schema = Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
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
    const user = await UserModel.findOne({ userId: req.params.userId });

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
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
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

export const listOrders = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ userId: req.params.userId });
  
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
  
  export const calculateTotalPrice = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findOne({ userId: req.params.userId });
  
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

