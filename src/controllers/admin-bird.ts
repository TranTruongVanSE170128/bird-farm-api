import { Request, Response } from 'express'

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Bird from '../models/bird'

dotenv.config()

export const getAdminBirds = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const searchQuery = (req.query.searchQuery as string) || ''
  const specieId = req.query.specie as string

  const query = specieId
    ? {
        specie: new mongoose.Types.ObjectId(specieId),
        name: { $regex: searchQuery, $options: 'i' }
      }
    : { name: { $regex: searchQuery, $options: 'i' } }

  try {
    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      // .select('name imageUrls price gender discount specie')
      .populate('specie')
      .exec()

    const totalBirds = await Bird.countDocuments(query)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách chim thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBirds / pageSize),
      birds: birds
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
