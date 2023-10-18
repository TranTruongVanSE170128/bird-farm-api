import { Request, Response } from 'express'
import Specie from '../models/specie'
import {
  addSpecieSchema,
  getPaginationSpeciesSchema,
  updateSpecieSchema,
  getSpecieDetailSchema,
  deleteSpecieSchema
} from '../validations/specie'
import { zParse } from '../helpers/z-parse'
import Bird from '../models/bird'
import Nest from '../models/nest'

const getAllSpecies = async (req: Request, res: Response) => {
  try {
    const species = await Specie.find()
    res.status(200).json({ success: false, message: 'Lấy danh sách loài thành công', species })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const getSpecieDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getSpecieDetailSchema, req)
  try {
    const specie = await Specie.findById(id)
    res.status(200).json({ success: true, message: 'Lấy loài chim thành công.', specie })
  } catch (err) {
    console.log(err)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const getPaginationSpecies = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationSpeciesSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1
  const searchQuery = query.searchQuery || ''

  const queryMongo = {
    name: { $regex: searchQuery, $options: 'i' }
  }

  try {
    const species = await Specie.find(queryMongo)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrl')
      .exec()

    const totalSpecies = await Specie.countDocuments(queryMongo)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách loài thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSpecies / pageSize),
      species
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const addSpecie = async (req: Request, res: Response) => {
  const { body } = await zParse(addSpecieSchema, req)

  try {
    const newSpecie = new Specie(body)
    await newSpecie.save()

    res.status(201).json({ success: true, message: 'Loài đã được tạo thành công.', specie: newSpecie })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const updateSpecie = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateSpecieSchema, req)

  try {
    const specie = await Specie.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json({ success: true, message: 'Loài đã được cập nhật thành công.', specie })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export const deleteSpecie = async (req: Request, res: Response) => {
  const {
    params: { id: specieId }
  } = await zParse(deleteSpecieSchema, req)
  try {
    const specie = await Specie.findById(specieId)
    if (!specie) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy loài.' })
    }
    const birds = await Bird.find({ specie: specieId })
    if (birds.length > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa loài có dữ liệu chim.' })
    }
    const nests = await Nest.find({ specie: specieId })
    if (nests.length > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa loài có dữ liệu tổ chim.' })
    }
    Specie.findByIdAndRemove(specieId)
    res.status(400).json({ success: false, message: 'Đã xóa loài thành công.' })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export { getAllSpecies, addSpecie, updateSpecie, getPaginationSpecies, getSpecieDetail }
