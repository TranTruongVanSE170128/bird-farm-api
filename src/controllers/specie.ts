import { Request, Response } from 'express'
import Specie from '../models/specie'
import { resetPassword } from './auth'

const getAllSpecie = async (req: Request, res: Response) => {
  // lấy dữ liệu từ query
  const pageSize = parseInt(req.query.pageSize as string) || 5 // mặc định pageSize=2 nếu k có pageSize trên query
  const pageNumber = parseInt(req.query.pageNumber as string) || 1 // tương tự với pageNumber
  const name = req.query.name as string
  const pagination = req.query.pagination === 'true'

  const query = name ? { name: { $regex: name, $options: 'i' } } : {} // query này sẽ dùng nếu name lấy trong request query là
  //undefined sẽ lấy tất cả , ngược lại sẽ lấy theo name
  try {
    const species = pagination
      ? await Specie.find(query)
          .limit(pageSize)
          .skip(pageSize * (pageNumber - 1))
          .select('name imageUrl')
          .exec()
      : await Specie.find(query).select('name imageUrl').exec()

    const totalSpecies = await Specie.countDocuments(query)

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách loài thành công!',
      currentPage: species ? pageNumber : 0,
      totalPage: Math.ceil(totalSpecies / pageSize),
      species: species ? species : []
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống!' })
  }
}

const addSpecie = async (req: Request, res: Response) => {
  const { name, imageUrl, description } = req.body
  try {
    const nameSearch=name.toString()
    const query = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    
    const specie = await Specie.findOne(query);
    
    if(specie)  return res.status(400).json({success: false, message:'Loài này đã xuất hiện trong danh sách'})
    
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
