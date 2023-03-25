import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import moment from 'moment';
// models
import User from '../models/User.js';
import { Member, Role } from '../constant/enums.js';
import { generateUsername } from 'unique-username-generator';
import jwt from 'jsonwebtoken';
const KEY = 'ghjsgdagfzdugfdhfljdshfidsufsd';
mongoose.set('useFindAndModify', false);
import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

// third part
import bcrypt from 'bcryptjs';

export default {
  onFindOneAndUpdateUser: async (req, res) => {
    try {
      const data = JSON.parse(JSON.stringify(req.body));
      const username = data.Username;

      const token = jwt.sign(
        {
          Username: username,
          CreatedAt: new Date(),
        },
        KEY
      );

      const user = await User.findOneAndUpdate(
        { Username: data.Username, Password: data.Password },
        { Token: 'Token ' + token, TokenUpdatedAt: new Date() },
        { new: true }
      );

      res.status(201).json({ Token: user['Token'] });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onEmailExists: async (req, res) => {
    // extracting data from body
    const { Email } = req.body;

    if (Email) {
      try {
        const user = await User.findOne({ Email: Email });

        // if exists
        if (user) {
          return res.status(200).json({
            success: true,
            isExists: true,
            message: 'Email already taken',
          });
        } else {
          return res.status(200).json({
            success: true,
            isExists: false,
            message: 'Email is available',
          });
        }
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: 'something went wrong.' });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
  },

  onLogin: async (req, res) => {
    // extracting data from body
    const { Email, Password } = req.body;

    if (Email && Password) {
      try {
        // find user with email
        const user = await User.findOne({ Email: Email });

        // if exists
        if (user) {
          // compare password
          const isValidPassword = await bcrypt.compare(Password, user.Password);

          if (isValidPassword) {
            // create token
            const token = jwt.sign(
              {
                userId: user._id,
                Username: user.Username,
              },
              KEY,
              {
                expiresIn: '1h',
              }
            );

            return res.status(200).json({
              success: true,
              message: 'successful',
              data: user,
              token: token,
            });
          } else {
            return res
              .status(400)
              .json({ success: false, message: 'Password is incorrect' });
          }
        } else {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        }
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: 'something went wrong.' });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email and Password is required',
      });
    }
  },
  onRegister: async (req, res) => {
    // extracting data from body
    const { PublicKey } = req.body;

    try {
      // Email
      let user = await User.findOne({ PublicKey: PublicKey });
      // if exists
      if (user) {
        // return the user

        const token = jwt.sign(
          {
            userId: user._id,
            publicKey: user.PublicKey,
          },
          KEY,
          {
            expiresIn: '12h',
          }
        );
        res.status(200).json({
          success: true,
          data: user,
          token: token,
          isNewUser: false,
          message: 'Successful',
        });
      } else {
        const dummyUsername = generateUsername('_', 0, 15);
        const dummyEmail = dummyUsername + 'example.com';

        //Unique Name
        //* 16 random bytes
        const rawBytes = await randomBytes(1);
        const randomNum = rawBytes.toString('hex');
        let userName = 'user' + randomNum;
        let userEmail = 'user' + randomNum + '@example.com';
        user = await User.create({
          Username: userName,
          Email: userEmail,
          ProfilePicture: '',
          Token: '',
          TokenFirstCreatedAt: '',
          PublicKey: PublicKey,
          Roles: [Role[1]],
          TokenUpdatedAt: '',
          CreatedAt: new Date(),
          Bio: '',
          Country: '',
          Skills: [],
          Author: {
            SocialLinks: [],
            Member: Member[0],
            RecognizationsAndAwards: [],
            Certification: [],
            MostPopular: [],
            Contributions: [],
          },
        });

        const token = jwt.sign(
          {
            userId: user._id,
            publicKey: user.PublicKey,
          },
          KEY,
          {
            expiresIn: '12h',
          }
        );
        res.status(201).json({
          success: true,
          data: user,
          token: token,
          isNewUser: true,
          message: 'Successful',
        });
      }
    } catch (error) {
      console.log('error ===>', error);
      res.status(400).json({
        success: false,
        error: 'Something went wrong please try again',
      });
    }
  },
  onForgetPassword: async (req, res) => {
    const { Email } = req.body;

    try {
      // does email exists in  our system
      const user = await User.findOne({ Email: Email });

      if (user) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ketogenic0334@gmail.com',
            pass: 'uaxkvybjunncmgqg',
          },
        });
        // generate token for
        const token = jwt.sign(
          {
            userID: user._id,
            Username: user.Username,
          },
          KEY,
          { expiresIn: 600 }
        );

        var mailOptions = {
          from: 'ketogenic0334@gmail.com',
          to: user.Email,
          subject: 'Sending Email using Node.js',
          text: `HI Please find this link localhost http://localhost:8000/auth/resetPass?token=${token}
            Note: this email will be expire in 10 minutes `,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            return res.status(500).json({
              success: true,
              message: 'something went wrong',
            });
          } else {
            console.log('Email sent: ' + info.response);
            var oldDateObj = new Date();
            var newDateObj = new Date();
            newDateObj.setTime(oldDateObj.getTime() + 10 * 60 * 1000);
            const updateUser = await User.findOneAndUpdate(
              { _id: user._id },
              { ForgetPasswordLinkExpire: newDateObj }
            );
            console.log('updateUser ===>', updateUser);

            if (updateUser) {
              console.log('updateUser ===>', updateUser);
              return res.status(200).json({
                success: true,
                message: 'Email send Successful',
              });
            } else {
              return res.status(500).json({
                success: true,
                message: 'something went wrong',
              });
            }
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Email does not exists in our System',
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: 'something went wrong.' });
    }
  },
  onChangePassword: async (req, res) => {
    const { token, Password } = req.body;
    try {
      const decodedToken = jwt.verify(token, KEY);

      // find user
      const user = await User.findOne({ _id: decodedToken.userID });

      if (user) {
        /**
        * 
        * let parseDate = parseInt(user[0].ForgetPasswordLinkExpire);
          const tokenExpireDate = new moment(parseDate);
           var now = new Date();
           // condition now.getTime() <= tokenExpireDate.getTime()
        */

        if (true) {
          const hashPassword = await bcrypt.hash(Password, 10);
          console.log('hashPassword ==>', user);
          await User.updateOne({ _id: user._id }, { Password: hashPassword });

          res.status(200).json({
            success: true,
            message: 'Successful',
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'Link expire',
          });
        }
      }
    } catch (error) {
      console.log('error ==>', JSON.stringify(error));
      res.status(500).json({
        success: false,
        message:
          error?.name == 'TokenExpiredError'
            ? 'Link expire'
            : 'something went wrong.',
      });
    }
  },
};
