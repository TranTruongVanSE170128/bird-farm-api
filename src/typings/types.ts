export type User = {
  _id: string
  name: string
  email: string
  imageUrl?: string
  role: Role
}

export type Specie = {
  _id: string
  name: string
  imageUrl?: string
  description?: string
}

export type Bird = {
  _id: string
  specie: Specie | string
  name: string
  sold: boolean
  type: BirdType
  birth?: Date
  gender: Gender
  sellPrice: number
  breedPrice: number
  description?: string
  imageUrls?: string[]
  parent?: Parent
  achievements?: Achievement[]
  discount?: Discount
}

export type Nest = {
  _id: string
  dad: Bird | string
  mom: Bird | string
  name: string
  specie: Specie | string
  sold: boolean
  price: number
  imageUrls?: string[]
  description?: string
}

export type Order = {
  _id: string
  birds: Bird[] | string[]
  nests: Nest[] | string[]
  user: User | string
  receiver: string
  address: string
  phone: string
  createdAt: Date
  totalMoney: number
  status: OrderStatus
}

export type Gender = 'male' | 'female'

export type BirdType = 'sell' | 'breed'

export type Parent = {
  dad?: string | Bird
  mom?: string | Bird
}
export type Achievement = {
  competition: string
  rank: number
  _id: string
}

export type Discount = {
  discountPercent: number
  startDate: Date
  endDate: Date
}

export type OrderStatus = 'processing' | 'delivering' | 'success' | 'canceled'

export enum Role {
  Customer = 'customer',
  Staff = 'staff',
  Admin = 'admin'
}
