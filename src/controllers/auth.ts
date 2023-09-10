import { Request, Response } from 'express';
import User from '../models/user';
import { convertUserIdToJwt } from '../helpers/convertUserIdToJwt';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import axios from 'axios';

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

    const accessToken = convertUserIdToJwt(newUser.id);

    res.json({
      success: true,
      message: 'User created successfully',
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export { loginByGoogle, signIn, signUp };
