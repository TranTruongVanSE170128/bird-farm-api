import { Request, Response } from 'express'
import Specie from '../models/specie'
import {
  addSpecieSchema,
  getPaginationSpeciesSchema,
  updateSpecieSchema,
  getSpecieDetailSchema
} from '../validations/specie'
import { zParse } from '../helpers/z-parse'

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
  const pageNumber = query.pageNumber || 5
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

export { getAllSpecies, addSpecie, updateSpecie, getPaginationSpecies, getSpecieDetail }
