import { Request, Response } from 'express'
import Specie from '../models/specie'

const getAllSpecie = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const name = req.query.searchQuery as string

  const query = name ? { name: { $regex: name, $options: 'i' } } : {}
  try {
    const species = await Specie.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrl')
      .exec()

    const totalSpecies = await Specie.countDocuments(query)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách loài thành công!',
      currentPage: species ? pageNumber : 0,
      totalPages: Math.ceil(totalSpecies / pageSize),
      species: species ? species : []
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const addSpecie = async (req: Request, res: Response) => {
  const { name, imageUrl, description } = req.body
  try {
    const query = { name: { $regex: new RegExp(`^${name}$`, 'i') } }

    const specie = await Specie.findOne(query)

    if (specie) return res.status(400).json({ success: false, message: 'Loài này đã xuất hiện trong danh sách' })

    const newSpecie = new Specie({ name, imageUrl, description })
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
