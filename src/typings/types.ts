export type User = {
  _id?: string
  name: string
  email: string
  imageUrl?: string
  role: Role
}

export type Specie = {
  _id?: string
  name: string
  imageUrl?: string
  description?: string
}

export type Bird = {
  _id?: string
  specie: Specie
  name: string
  sold: boolean
  onSale: boolean
  birth?: Date
  gender: Gender
  price?: number
  description?: string
  imageUrls?: string[]
  parent?: Parent
  achievements?: Achievement[]
  discount?: Discount
}

export type Gender = 'male' | 'female'

export type Parent = {
  dad?: string
  mom?: string
}
export type Achievement = {
  competition: string
  rank: number
}

export type Discount = {
  discountPercent: number
  startDate: Date
  endDate: Date
}

export type Role = 'customer' | 'staff' | 'manager'
