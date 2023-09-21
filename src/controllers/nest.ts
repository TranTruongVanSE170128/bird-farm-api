import { Request, Response } from 'express'
import Nest from '../models/nest'
import { zParse } from '../helpers/z-parse'
import {
  createNestSchema,
  getNestByIdSchema,
  getNestsByIdsSchema,
  getPaginationNestsSchema,
  updateNestSchema
} from '../validations/nest'

const getAllNests = async (req: Request, res: Response) => {
  try {
    const nests = await Nest.find()
    res.status(200).json({ success: true, message: 'Lấy danh sách tổ thành công.', nests })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const getPaginationNests = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationNestsSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 5
  const searchQuery = query.searchQuery || ''

  const queryMongo = {
    name: { $regex: searchQuery, $options: 'i' }
  }

  try {
    const nests = await Nest.find(queryMongo)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .exec()

    const totalNests = await Nest.countDocuments(queryMongo)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ chim thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalNests / pageSize),
      nests
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const getNestById = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getNestByIdSchema, req)
  try {
    const nest = Nest.findById(id)
    res.status(200).json({ success: true, message: 'Lấy tổ chim thành công.', nest })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getNestsByIds = async (req: Request, res: Response) => {
  const {
    body: { nests: ids }
  } = await zParse(getNestsByIdsSchema, req)

  try {
    const query = { _id: { $in: ids }, onSale: true }

    const nests = await Nest.find(query)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tổ chim thành công.',
      nests
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const createNest = async (req: Request, res: Response) => {
  const { body } = await zParse(createNestSchema, req)
  try {
    const newNest = new Nest(body)
    await newNest.save()

    res.status(201).json({ success: true, message: 'Tạo tổ chim thành công.', nest: newNest })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const updateNest = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateNestSchema, req)

  try {
    const nest = await Nest.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json({ success: true, message: 'Tổ chim đã được cập nhật thành công.', nest })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export { getAllNests, getNestById, updateNest, createNest, getPaginationNests }
