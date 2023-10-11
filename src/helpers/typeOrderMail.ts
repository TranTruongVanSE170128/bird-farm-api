interface TableDataItem {
  'Sản phẩm': string
  Giá: number
}

type mailOrder = {
  body: {
    name: string
    intro: string[]
    table: {
      data: TableDataItem[]
      columns: {
        customWidth: {
          'Sản phẩm': '20%'
          Giá: '15%'
        }
        customAlignment: {
          Giá: 'right'
        }
      }
    }

    outro: string[]
  }
}

export default mailOrder
