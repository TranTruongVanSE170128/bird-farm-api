import { Request, Response } from 'express'
import { zParse } from '../helpers/z-parse'
import { createVoucherSchema, getVoucherDetailSchema } from '../validations/voucher'
import Voucher from '../models/voucher'
import { getPaginationVouchersSchema } from '../validations/voucher'

export const getAllVoucher = async (req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find()

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách vouchers thành công!',
      vouchers
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getPaginationVouchers = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationVouchersSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1

  try {
    const vouchers = await Voucher.find()
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .sort({ createdAt: -1 })
      .exec()

    const totalVouchers = await Voucher.countDocuments()

    res.status(200).json({
      success: true,
      message: 'Lấy danh voucher thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVouchers / pageSize),
      vouchers
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const { body } = await zParse(createVoucherSchema, req)

    const voucher = new Voucher(body)

    await voucher.save()

    return res.status(200).json({ success: true, message: 'Tạo voucher mới thành công!', voucher })
  } catch (error) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const getVoucherDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getVoucherDetailSchema, req)
  try {
    const voucher = await Voucher.findById(id)
    res.status(200).json({ success: true, message: 'Lấy voucher thành công.', voucher })
  } catch (err) {
    console.log(err)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
