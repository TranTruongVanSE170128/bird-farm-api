import { Request, Response } from 'express'
import Specie from '../models/specie'

const getAllSpecie = async (req: Request, res: Response) => {
  try {
    const species = await await Specie.find().select('name imageUrl')
    if (!species) {
      res.status(404).json({ success: false, message: 'Không có dữ liệu.' })
      return
    }

    res.status(200).json(species)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

const addSpecie = async (req: Request, res: Response) => {
  const { name, imageUrl, description, code } = req.body
  try {
    const specieByCode = await Specie.findOne({ code })
    if (specieByCode) {
      res.status(400).json({ success: false, message: 'Mã loài đã tồn tại.' })
      return
    }

    const newSpecie = new Specie({ name, imageUrl, description, code })
    await newSpecie.save()

    res.status(201).json({ message: 'Loài đã được tạo thành công.', specie: newSpecie })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

const updateSpecie = async (req: Request, res: Response) => {
  const id = req.params.id
  const { name, imageUrl, description, code } = req.body

  try {
    const specieById = await Specie.findById(id)
    if (!specieById) {
      res.status(404).json({ message: 'Không tìm thấy loài.' })
      return
    }

    const specieByCode = await Specie.findOne({ code })
    if (specieByCode && specieByCode._id.toString() !== specieById._id.toString()) {
      res.status(400).json({ success: false, message: 'Mã loài đã tồn tại.' })
      return
    }
    
    specieById.name = name
    specieById.imageUrl = imageUrl
    specieById.description = description
    specieById.code = code
    await specieById.save()

    res.status(200).json({ message: 'Loài đã được cập nhật thành công.', specieById })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

export { getAllSpecie, addSpecie, updateSpecie }
