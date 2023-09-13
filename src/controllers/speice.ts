import { Request, Response } from 'express'
import Speice from '../models/specie'

const getAllSpeice = async (req: Request, res: Response) => {
  try {
    const spieces = await Speice.find({}, { name: 1, imageUrl: 1 })
    if (!spieces) {
      res.status(404).json({ success: false, message: 'Không có dữ liệu.' })
      return
    }

    res.status(200).json(spieces)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

const addSpeice = async (req: Request, res: Response) => {
  const { name, imageUrl, description, code } = req.body
  try {
    const speiceByCode = await Speice.findOne({ code })
    if (speiceByCode) {
      res.status(400).json({ success: false, message: 'Mã loài đã tồn tại.' })
      return
    }

    const newSpeice = new Speice({ name, imageUrl, description, code })
    await newSpeice.save()

    res.status(201).json({ message: 'Loài đã được tạo thành công.', speice: newSpeice })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

const updateSpeice = async (req: Request, res: Response) => {
  const id = req.params.id
  const { name, imageUrl, description, code } = req.body

  try {
    const speiceById = await Speice.findById(id)
    if (!speiceById) {
      res.status(404).json({ message: 'Không tìm thấy loài.' })
      return
    }

    const speiceByCode = await Speice.findOne({ code })
    if (speiceByCode && speiceByCode._id.toString() !== speiceById._id.toString()) {
      res.status(400).json({ success: false, message: 'Mã loài đã tồn tại.' })
      return
    }

    speiceById.name = name
    speiceById.imageUrl = imageUrl
    speiceById.description = description
    speiceById.code = code
    await speiceById.save()

    res.status(200).json({ message: 'Loài đã được cập nhật thành công.', speiceById })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi hệ thống!' })
  }
}

export { getAllSpeice, addSpeice, updateSpeice }
