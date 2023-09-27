import { Request, Response } from 'express'
import Bird from '../models/bird'
import mongoose, { ObjectId, isValidObjectId } from 'mongoose'
import { zParse } from '../helpers/z-parse'
import {
  getBirdDetailSchema,
  getBirdsBreedSchema,
  getBirdsByIdsSchema,
  // getPaginationBirdsAdminSchema,
  getPaginationBirdsSchema,
  updateBirdSchema
} from '../validations/bird'

export const getPaginationBirds = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationBirdsSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1
  const searchQuery = query.searchQuery || ''
  const specieId = query.specie
  const type = query.type

  try {
    const query: any = { name: { $regex: searchQuery, $options: 'i' }, sold: false }

    if (specieId) {
      query.specie = new mongoose.Types.ObjectId(specieId)
    }

    if (type) {
      query.type = type
    }

    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrls price gender discount specie type sellPrice breedPrice')
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

// export const getPaginationBirdsAdmin = async (req: Request, res: Response) => {
//   const { query } = await zParse(getPaginationBirdsAdminSchema, req)
//   const pageSize = query.pageSize || 5
//   const pageNumber = query.pageNumber || 5
//   const searchQuery = query.searchQuery || ''
//   const specieId = query.specie

//   try {
//     const query = specieId
//       ? {
//           specie: new mongoose.Types.ObjectId(specieId),
//           name: { $regex: searchQuery, $options: 'i' }
//         }
//       : { name: { $regex: searchQuery, $options: 'i' } }

//     const birds = await Bird.find(query)
//       .limit(pageSize)
//       .skip(pageSize * (pageNumber - 1))
//       .select('name imageUrls price gender discount type')
//       .populate('specie', { name: 1 })
//       .exec()

//     const totalBirds = await Bird.countDocuments(query)

//     res.status(200).json({
//       success: true,
//       message: 'Lấy danh sách chim thành công!',
//       currentPage: pageNumber,
//       totalPages: Math.ceil(totalBirds / pageSize),
//       birds: birds
//     })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
//   }
// }

export const getBirdDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(getBirdDetailSchema, req)

  try {
    const bird = await Bird.findById(id).populate('specie', { name: 1 })

    if (!bird) {
      res.status(404).json({ success: false, message: 'Không tìm thấy chim' })
    }

    if (bird?.parent && bird.parent.dad) {
      bird.parent.dad = (await Bird.findById(bird.parent.dad)) as any
    }

    if (bird?.parent && bird.parent.mom) {
      bird.parent.mom = (await Bird.findById(bird.parent.mom)) as any
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
  const {
    body: { birds: ids }
  } = await zParse(getBirdsByIdsSchema, req)

  try {
    const query = { _id: { $in: ids } }

    const birds = await Bird.find(query).select('-sold -description').populate('specie', { name: 1 })

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách chim thành công.',
      birds: birds
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const getBirdsBreed = async (req: Request, res: Response) => {
  const {
    query: { specie }
  } = await zParse(getBirdsBreedSchema, req)

  try {
    const query = { specie: new mongoose.Types.ObjectId(specie) }
    const birds = await Bird.find(query).select('gender name')
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

export const updateBird = async (req: Request, res: Response) => {
  const {
    params: { id },
    body
  } = await zParse(updateBirdSchema, req)

  try {
    const bird = await Bird.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json({ success: true, message: 'Chim đã được cập nhật thành công.', bird })
  } catch (err) {
    res.status(500).json({ success: true, message: 'Lỗi hệ thống!' })
  }
}
