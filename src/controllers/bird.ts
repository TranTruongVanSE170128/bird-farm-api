import { Request, Response } from 'express'
import Bird from '../models/bird'
import mongoose, { ObjectId, isValidObjectId } from 'mongoose'

export const getSearchBirds = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const searchQuery = (req.query.searchQuery as string) || ''
  const specieId = req.query.specieId as string

  const query = specieId
    ? {
        specie: new mongoose.Types.ObjectId(specieId),
        name: { $regex: searchQuery, $options: 'i' },
        onSale: true
      }
    : { name: { $regex: searchQuery, $options: 'i' }, onSale: true }

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

export const createBird = async (req: Request, res: Response) => {
  try {
    const newBird = new Bird(req.body)
    await newBird.save()

    res.status(201).json({ success: true, message: 'Chim mới đã được tạo thành công.', bird: newBird })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getBirdsByIds = async (req: Request, res: Response) => {
  const ids = req.body.birdIds
  const validIds = ids.filter((id: string) => isValidObjectId(id))

  try {
    const query = { _id: { $in: validIds }, onSale: true }

    const birds = await Bird.find(query).select('-sold -onSale -description').populate('specie')

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách chim thành công.',
      birds: birds
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
