import { Request, Response } from 'express'
import Bird from '../models/bird'
import mongoose, { isValidObjectId } from 'mongoose'

export const getSearchBirds = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5
  const pageNumber = parseInt(req.query.pageNumber as string) || 1
  const searchQuery = (req.query.searchQuery as string) || ''
  const specieId = req.query.specie as string

  try {
    const query =
      specieId && isValidObjectId(specieId)
        ? {
            specie: new mongoose.Types.ObjectId(specieId),
            name: { $regex: searchQuery, $options: 'i' },
            onSale: true
          }
        : { name: { $regex: searchQuery, $options: 'i' }, onSale: true }

    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrls price gender discount specie')
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

export const getBirdDetail = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const bird = await Bird.findById(id).populate('specie', { name: 1 })

    if (!bird) {
      res.status(404).json({ success: false, message: 'Không tìm thấy chim' })
    }

    res.status(201).json({ success: true, bird })
  } catch (err) {
    console.log(err)
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
  const ids = req.body.birds
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

export const getBirdsBySpecie = async (req: Request, res: Response) => {
  try {
    const specieId = req.query.specie as string
    if (!isValidObjectId(specieId))
      return res.status(400).json({ success: false, message: 'Lấy chim theo loài không thành công' })

    const query = { specie: new mongoose.Types.ObjectId(specieId), onSale: true }

    const birds = await Bird.find(query).exec()

    const birdsMale = birds.filter((bird) => bird.gender === 'male')
    const birdsFemale = birds.filter((bird) => bird.gender === 'female')

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách chim đực và chim cái theo loài thành công',
      birdsMale: birdsMale,
      birdsFemale: birdsFemale
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
