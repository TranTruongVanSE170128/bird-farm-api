import { Request, Response } from "express"
import Bird from '../models/bird'

const getAllSpecie = async (req: Request, res: Response) => {
    // lấy dữ liệu từ query
    const pageSize = parseInt(req.query.pageSize as string) || 5 // mặc định pageSize=2 nếu k có pageSize trên query
    const pageNumber = parseInt(req.query.pageNumber as string) || 1 // tương tự với pageNumber
    const name = req.query.name as string
    const pagination = req.query.pagination === 'true'
    const age=parseInt(req.query.age as string) ||1
    const gender=req.query.gender as string
    const discount =parseInt(req.query.discount as string)
    const imageUrls=req.query.gender as string

    const query = name ?{
        $or: [
          { name: { $regex: name, $options: 'i' } }, // Case-insensitive search on 'name' field
          { age: { $eq: age } },                     // Exact match on 'age' field
          { gender: { $eq: gender } },               // Exact match on 'gender' field
          { discount: { $eq: discount } },        // Exact match on 'discount' field
          { image: { $regex: new RegExp(`^${imageUrls}$`, 'i'), $options: 'i' } } // Case-insensitive search on 'image' field
        ]
      }:{} // query này sẽ dùng nếu name lấy trong request query là
    //undefined sẽ lấy tất cả , ngược lại sẽ lấy theo name
    try {
      const birds = pagination
        ? await Bird.find(query)
            .limit(pageSize)
            .skip(pageSize * (pageNumber - 1))
            .select('name imageUrl')
            .exec()
        : await Bird.find(query).select('name imageUrl').exec()
  
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