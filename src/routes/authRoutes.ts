import express, {Router} from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/requestValidation';
import { authController } from '../controllers/authController';
import { rateLimiters } from '../middlewares/rateLimit';


const authRouter: Router = express.Router();


authRouter.post(
    '/register',

    body('username')
        .notEmpty()
        .withMessage("Username should not be Empty")
        .isString()
        .withMessage("Username should be a string")
        .isLength({min: 8, max: 15})
        .withMessage("Username should be between 8 and 15 characters")
        .trim()
        .escape(),

    body('email')
        .notEmpty()
        .withMessage("Email should not be Empty")
        .isString()
        .withMessage("Email should be a string")
        .isEmail()
        .withMessage("Entered email is not valid")
        .normalizeEmail(),
        
    body("password")
        .notEmpty()
        .withMessage("Password should not be empty")
        .isString()
        .withMessage("Password should be a valid String")
        .isLength({min: 8, max: 24})
        .withMessage("The Password should be between 8 and 24 characters long")
        .trim()
        .escape()
        .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}),

    validateRequest,
    authController.register
);


authRouter.post(
    '/login',
    
    body('username')
        .notEmpty()
        .withMessage("Username should not be Empty")
        .isString()
        .withMessage("Username should be a string")
        .isLength({ min: 8, max: 15 })
        .withMessage("Username should be between 8 and 15 characters")
        .trim()
        .escape(),

    body('password')
        .notEmpty()
        .withMessage("Password should not be empty")
        .isString()
        .withMessage("Password should be a valid String")
        .isLength({ min: 8, max: 24 })
        .withMessage("The Password should be between 8 and 24 characters long")
        .trim()
        .escape()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),

    validateRequest,
    authController.login
);


authRouter.get(
    '/token/refresh',
    rateLimiters.refreshTokenRateLimit,
    authController.tokenRefresh
);

authRouter.get(
    '/checkUser',
    rateLimiters.refreshTokenRateLimit,
    authController.checkUser
    
);

export default authRouter;