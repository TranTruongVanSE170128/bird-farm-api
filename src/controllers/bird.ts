import { Request, Response } from "express"
import Bird from '../models/bird'

export const getAllBird = async (req: Request, res: Response) => {
    // lấy dữ liệu từ query
    const pageSize = parseInt(req.query.pageSize as string) || 5 // mặc định pageSize=2 nếu k có pageSize trên query
    const pageNumber = parseInt(req.query.pageNumber as string) || 1 // tương tự với pageNumber
    const name = req.query.name as string
    const pagination = req.query.pagination === 'true'
    const age=parseInt(req.query.age as string) 
    const gender=req.query.gender as string
    const discount =parseInt(req.query.discount as string)
    const imageUrls=req.query.gender as string

    const query = name ?{
        $or: [
          { name: { $regex: name, $options: 'i' } }, 
          { age: { $eq: age } },                     
          { gender: { $eq: gender } },               
          { discount: { $eq: discount } },        
          { imageUrls: { $regex: new RegExp(`^${imageUrls}$`, 'i'), $options: 'i' } } 
        ]
      }:{} 
    try {
      const birds = pagination
        ? await Bird.find(query)
            .limit(pageSize)
            .skip(pageSize * (pageNumber - 1))
            .select('name age gender discount imageUrls')
            .exec()
        : await Bird.find(query).select('name age gender discount imageUrls').exec()
  
      const totalBird = await Bird.countDocuments(query)
  
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách chim thành công!',
        currentPage: birds ? pageNumber : 0,
        totalPage: Math.ceil(totalBird / pageSize),
        species: birds ? birds : []
      })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
    }
  }