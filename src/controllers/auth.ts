import { Request, Response } from 'express';
import User from '../models/user';
import Token from '../models/token';
import { convertUserIdToJwt } from '../helpers/convert-user-id-to-jwt';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import axios from 'axios';
import crypto from 'crypto';
import { sendEmail } from '../helpers/mailer';

dotenv.config();

type UserGoogle = {
  picture: string;
  email: string;
  email_verified: true;
};

const loginByGoogle = async (req: Request, res: Response) => {
  const { accessTokenGoogle } = req.body;

  const googleResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessTokenGoogle}`,
      },
    }
  );

  const userGoogle: UserGoogle = googleResponse.data;

  if (!userGoogle.email_verified) {
    return res
      .status(403)
      .json({ success: false, message: 'The emails are not verified' });
  }

  const user = await User.findOne({ email: userGoogle.email });

  if (!user) {
    const { email, picture: imageUrl } = userGoogle;
    const newUser = new User({
      email,
      imageUrl,
    });

    await newUser.save();
    const accessToken = convertUserIdToJwt(newUser.id);
    return res.json({
      success: true,
      message: 'User logged in successfully',
      accessToken,
    });
  }

  const accessToken = convertUserIdToJwt(user.id);
  res.json({
    success: true,
    message: 'User logged in successfully',
    accessToken,
  });
};

const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: 'Incorrect username and/or password ',
      });

    const passwordValid = await argon2.verify(user.password!, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: 'Incorrect username and/or password',
      });

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is not verified',
        userId: user.id,
        email: user.email,
      });
    }

    const accessToken = convertUserIdToJwt(user.id);

    res.json({
      success: true,
      message: 'User logged in successfully',
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const signUp = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  try {
    const userByName = await User.findOne({ username });
    const userByEmail = await User.findOne({ email });

    if (userByName || userByEmail)
      return res
        .status(400)
        .json({ success: false, message: 'Username or Email already exists' });

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = await new Token({
      user: newUser.id,
      token: crypto.randomBytes(4).toString('hex'),
    }).save();

    const mailContent = {
      body: {
        name: newUser.username,
        intro: 'Chào mừng đến với Bird Farm. Dưới đây là mã xác thực của bạn:',
        outro: `Mã xác thực của bạn là: ${token.token}`,
      },
    };

    await sendEmail({
      userEmail: newUser.email!,
      mailContent,
      subject: 'Verify Email',
    });

    res.status(200).json({
      success: true,
      message: 'User should receive an email with verify code',
      email: newUser.email,
      userId: newUser.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const verifyUser = async (req: Request, res: Response) => {
  const { id, token: tokenParam } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Not found user' });
    }

    const token = await Token.findOne({
      user: user._id,
      token: tokenParam,
    });
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: 'Not found token' });
    }

    user.verified = true;
    await user.save();
    await token.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export { loginByGoogle, signIn, signUp, verifyUser };
