import { Request, Response } from 'express'
import Specie from '../models/specie'

const getAllSpecie = async (req: Request, res: Response) => {
  const { pagination, pageSize, pageNumber, fieldNames } = req.body
  const skipSpecies = pageSize * (pageNumber - 1)

  try {
    const species = pagination
      ? await Specie.find().limit(pageSize).skip(skipSpecies).select(fieldNames)
      : await Specie.find().select(fieldNames)
    res.status(200).json({ success: true, message: 'Lấy danh sách loài thành công!', species: species ? species : [] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const addSpecie = async (req: Request, res: Response) => {
  const { name, imageUrl, description, code } = req.body
  try {
    const specieByCode = await Specie.findOne({ code })
    if (specieByCode) {
      return res.status(400).json({ success: false, message: 'Mã loài đã tồn tại.', specie: specieByCode })
    }

    const newSpecie = new Specie({ name, imageUrl, description, code })
    await newSpecie.save()

    res.status(201).json({ success: true, message: 'Loài đã được tạo thành công.', specie: newSpecie })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const updateSpecie = async (req: Request, res: Response) => {
  const id = req.params.id
  const newSpecie = req.body

  try {
    const specie = await Specie.findByIdAndUpdate(id, newSpecie, { new: true })
    res.status(200).json({ success: true, message: 'Loài đã được cập nhật thành công.', specie })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}

export { getAllSpecie, addSpecie, updateSpecie }
