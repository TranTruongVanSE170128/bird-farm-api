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
  updateBirdSchema,
  deleteBirdSchema
} from '../validations/bird'
import birdDescription from '../../random/bird-descriptions.json'

export const getPaginationBirds = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationBirdsSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1
  const searchQuery = query.searchQuery || ''
  const specieId = query.specie
  const type = query.type
  const gender = query.gender
  const sort = query.sort || 'createdAt_-1'

  try {
    const query: any = {
      name: { $regex: searchQuery, $options: 'i' },
      $or: [
        { breeding: false, type: 'breed' },
        { sold: false, type: 'sell' }
      ]
    }

    if (specieId) {
      query.specie = new mongoose.Types.ObjectId(specieId)
    }

    if (type) {
      query.type = type
    }

    if (gender) {
      query.gender = gender
    }

    const sortCondition: any = () => {
      const [keySort, orderSort] = sort.split('_')
      if (keySort === 'price') {
        if (!type) {
          return { sellPrice: Number(orderSort), breedPrice: Number(orderSort) }
        } else {
          return { [type === 'sell' ? 'sellPrice' : 'breedPrice']: Number(orderSort) }
        }
      } else {
        return { createdAt: -1 }
      }
    }

    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrls price gender discount specie type sellPrice breedPrice')
      .populate('specie')
      .sort(sortCondition())
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

export const getPaginationBirdsManage = async (req: Request, res: Response) => {
  const { query } = await zParse(getPaginationBirdsSchema, req)
  const pageSize = query.pageSize || 5
  const pageNumber = query.pageNumber || 1
  const searchQuery = query.searchQuery || ''
  const specieId = query.specie
  const type = query.type
  const gender = query.gender
  const sort = query.sort || 'createdAt_-1'
  const status = query.status

  try {
    const query: any = { name: { $regex: searchQuery, $options: 'i' } }

    if (specieId) {
      query.specie = new mongoose.Types.ObjectId(specieId)
    }

    if (type === 'sell') {
      query.type = type
      if (status === 'selling') {
        query.sold = false
      }
      if (status === 'sold') {
        query.sold = true
      }
    }

    if (type === 'breed') {
      query.type = type
      if (status === 'free') {
        query.breeding = false
      }
      if (status === 'breeding') {
        query.breeding = true
      }
    }

    if (gender) {
      query.gender = gender
    }

    const sortCondition: any = () => {
      const [keySort, orderSort] = sort.split('_')
      if (keySort === 'price') {
        if (!type) {
          return { sellPrice: Number(orderSort), breedPrice: Number(orderSort) }
        } else {
          return { [type === 'sell' ? 'sellPrice' : 'breedPrice']: Number(orderSort) }
        }
      } else {
        return { createdAt: -1 }
      }
    }

    const birds = await Bird.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1))
      .select('name imageUrls price gender discount specie type sellPrice breedPrice sold breeding')
      .populate('specie')
      .sort(sortCondition())
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
  const {
    params: { id }
  } = await zParse(getBirdDetailSchema, req)

  try {
    const bird = await Bird.findById(id).populate('specie', { name: 1 })

    if (!bird) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chim' })
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
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const deleteBird = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = await zParse(deleteBirdSchema, req)
  try {
    const bird = await Bird.findById(id)
    if (!bird) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy chim.' })
    }
    if (bird.sold) {
      return res.status(400).json({ success: false, message: 'Không thể xóa chim đã được bán.' })
    }
    if (bird.breeding) {
      return res.status(400).json({ success: false, message: 'Không thể xóa chim đang phối giống.' })
    }
    await Bird.findByIdAndRemove(id)
    res.status(200).json({ success: true, message: 'Đã xóa chim thành công' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

//dangerous
export const randomParent = async (req: Request, res: Response) => {
  try {
    const birds = await Bird.find()
    for (let i = 0; i < birds.length; i++) {
      const bird = birds[i]
      const ableParent = (await Bird.find({ specie: bird.specie })).filter(
        (b) => b._id.toString() !== bird._id.toString()
      )
      const ableDads = ableParent.filter((b) => b.gender === 'male')
      const ableMoms = ableParent.filter((b) => b.gender === 'female')
      bird.parent = {
        dad: ableDads.length > 0 ? ableDads[Math.floor(Math.random() * ableDads.length)].id : undefined,
        mom: ableMoms.length > 0 ? ableMoms[Math.floor(Math.random() * ableMoms.length)].id : undefined
      }
      await bird.save()
    }
    res.status(200).json({ success: true, message: 'Ngẫu nhiên chim bố mẹ thành công' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

export const randomDescription = async (req: Request, res: Response) => {
  try {
    const birds = await Bird.find()
    for (let i = 0; i < birds.length; i++) {
      const bird = birds[i]

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const ableDescriptions = birdDescription?.find((item) => item[bird.specie] !== undefined)?.[bird.specie]
      bird.description = ableDescriptions[Math.floor(Math.random() * ableDescriptions.length)]
      await bird.save()
    }
    res.status(200).json({ success: true, message: 'Ngẫu nhiên mô tả thành công' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}
