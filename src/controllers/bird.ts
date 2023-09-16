import { Request, Response } from 'express'
import Bird from '../models/bird'
import mongoose from 'mongoose'

export const getBird = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const specieId = req.query.searchQuery as string

  const query = specieId
    ? {
        $or: [{ specie: new mongoose.Types.ObjectId(specieId) }],
        $and: [{ onSale: true }]
      }
    : { onSale: true }
  try {
    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrls price gender discount specie')
      .exec()

    const totalBirds = await Bird.countDocuments(query)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách loài thành công!',
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBirds / pageSize),
      birds: birds
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
