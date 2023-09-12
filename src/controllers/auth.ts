import { Request, Response } from 'express'
import User from '../models/user'
import { convertUserIdToJwt } from '../helpers/convert-user-id-to-jwt'
import dotenv from 'dotenv'
import argon2 from 'argon2'
import axios from 'axios'
import crypto from 'crypto'
import { sendEmail } from '../helpers/mailer'

dotenv.config()

type UserGoogle = {
  picture: string
  email: string
  email_verified: true
}

const loginByGoogle = async (req: Request, res: Response) => {
  const { accessTokenGoogle } = req.body

  const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessTokenGoogle}`
    }
  })

  const userGoogle: UserGoogle = googleResponse.data

  if (!userGoogle.email_verified) {
    return res.status(403).json({ success: false, message: 'Email này chưa được xác thực!' })
  }

  const user = await User.findOne({ email: userGoogle.email })

  if (!user) {
    const { email, picture: imageUrl } = userGoogle
    const newUser = new User({
      email,
      imageUrl
    })

    await newUser.save()
    const accessToken = convertUserIdToJwt(newUser.id)
    return res.json({
      success: true,
      message: 'Bạn đăng nhập thành công!',
      accessToken
    })
  }

  const accessToken = convertUserIdToJwt(user.id)
  res.json({
    success: true,
    message: 'Bạn đăng nhập thành công!',
    accessToken
  })
}

const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user)
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng hoặc mật khẩu không hợp lệ.'
      })

    const passwordValid = await argon2.verify(user.password!, password)
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng hoặc mật khẩu không hợp lệ.'
      })

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Email này chưa được xác thực.',
        userId: user.id,
        email: user.email
      })
    }

    const accessToken = convertUserIdToJwt(user.id)

    res.json({
      success: true,
      message: 'Bạn đăng nhập thành công!',
      accessToken
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Phát hiện lỗi trong hệ thống!' })
  }
}

const signUp = async (req: Request, res: Response) => {
  const { username, password, email } = req.body

  try {
    const userByName = await User.findOne({ username })
    const userByEmail = await User.findOne({ email })

    if (userByName || userByEmail)
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng hoặc email đã được sử dụng.'
      })

    const hashedPassword = await argon2.hash(password)
    const verifyCode = crypto.randomBytes(4).toString('hex')
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyCode
    })

    await newUser.save()
    const mailContent = {
      body: {
        name: newUser.username,
        intro: 'Chào mừng đến với Bird Farm. Dưới đây là mã xác thực của bạn:',
        outro: `Mã xác thực của bạn là: ${newUser.verifyCode}`
      }
    }

    await sendEmail({
      userEmail: newUser.email!,
      mailContent,
      subject: 'Xác thực tài khoản.'
    })

    res.status(200).json({
      success: true,
      message: 'Hệ thống đã gửi mã xác thực đến email của bạn.',
      email: newUser.email,
      userId: newUser.id
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Phát hiện lỗi trong hệ thống!' })
  }
}

const verifyUser = async (req: Request, res: Response) => {
  const { id, verifyCode: code } = req.params

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Hệ thống không tìm thấy người dùng.'
      })
    }

    const verifyCode = user.verifyCode
    if (code !== verifyCode) {
      return res.status(400).json({ success: false, message: 'Mã xác thực không chính xác.' })
    }

    user.verified = true
    user.verifyCode = undefined
    await user.save()
    res.status(200).json({
      success: true,
      message: 'Hệ thống xác thực email thành công.'
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Phát hiện lỗi trong hệ thống!' })
  }
}

const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Hệ thống không tìm thấy người dùng.'
      })
    }

    if (!user.verified) {
      return res.status(400).json({ success: false, message: 'Email chưa được xác thực.' })
    }

    user.resetPasswordCode = crypto.randomBytes(4).toString('hex')
    await user.save()

    const mailContent = {
      body: {
        name: user.username,
        intro: 'Chào mừng đến với Bird Farm. Dưới đây là mã khôi phục mật khẩu của bạn:',
        outro: `Mã khôi phục mật khẩu của bạn là: ${user.resetPasswordCode}`
      }
    }

    await sendEmail({
      userEmail: user.email!,
      mailContent,
      subject: 'Xác thực tài khoản'
    })

    res.status(200).json({
      success: true,
      message: 'Hệ thống đã gửi mã xác thực đến email của bạn.',
      email: user.email,
      userId: user.id
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Phát hiện lỗi trong hệ thống!' })
  }
}

const resetPassword = async (req: Request, res: Response) => {
  const { id, resetPasswordCode } = req.params
  const { password } = req.body

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Hệ thống không tìm thấy người dùng.'
      })
    }

    if (user.resetPasswordCode !== resetPasswordCode) {
      return res.status(400).json({ success: false, message: 'Mã xác thực không chính xác.' })
    }

    user.resetPasswordCode = undefined
    const hashedPassword = await argon2.hash(password)
    user.password = hashedPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Hệ thống đặt lại mật khẩu thành công!'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Phát hiện lỗi trong hệ thống!' })
  }
}

export { loginByGoogle, signIn, signUp, verifyUser, forgetPassword, resetPassword }
