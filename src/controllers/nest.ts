import { Request, Response } from 'express'
import Nest from '../models/nest'
import mongoose, { ObjectId, isValidObjectId } from 'mongoose'

const getAllNest = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt(req.query.pageSize as string) || 5
    const pageNumber = parseInt(req.query.pageNumber as string) || 1
    const pagination = (req.query.pagination as string).trim() === 'true'

    const nests = pagination
      ? await Nest.find({})
          .populate('dad mom children specie')
          .limit(pageSize)
          .skip(pageSize * (pageNumber - 1))
          .exec()
      : await Nest.find({}).populate('dad mom children specie').exec()
    res.status(200).json({ success: true, message: 'Lấy danh sách tổ thành công.', nests: nests })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const getNestById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Lấy tổ không thành công!' })
    const nest = Nest.findById(id).populate('dad mom children specie').exec()
    res.status(200).json({ success: true, message: 'Lấy danh tổ thành công.', nest: nest })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const createNest = async (req: Request, res: Response) => {
  try {
    const newNest = new Nest(req.body)
    newNest.save()
    res.status(201).json({ success: true, message: 'Tạo mới tổ thành công.', nest: newNest })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const deleteNest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Xóa không thành công!' })
    Nest.findByIdAndRemove(id)
    res.status(201).json({ success: true, message: 'Xóa tổ thành công.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const updateNest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Cập nhập không thành công!' })
    const newNest = req.body
    Nest.findByIdAndUpdate(id, newNest, { new: true })
    res.status(201).json({ success: true, message: 'Cập nhập tổ thành công.', nest: newNest })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export { getAllNest, getNestById, deleteNest, updateNest, createNest }
