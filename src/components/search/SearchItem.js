import React, { memo, useState, useEffect } from 'react'
import icons from 'ultils/icons'
import { colors } from 'ultils/contants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from 'apis'
import useDebounce from 'hooks/useDebounce'

const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
  const navigate = useNavigate()
  const { category } = useParams()
  const [params] = useSearchParams()

  const [selected, setSelected] = useState([])
  const [bestPrice, setBestPrice] = useState(null)
  const [price, setPrice] = useState({
    from: '',
    to: ''
  })

  const handleSelect = (e) => {
    const alreadyEl = selected.find(el => el === e.target.value)
    if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
    else setSelected(prev => [...prev, e.target.value])
    changeActiveFilter(null)
  }

  useEffect(() => {
    let param = []
    for (const i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1]
    if (selected.length > 0) {
      if (selected) {
        queries.color = selected.join(',')
        queries.page = 1
      } else delete queries.color
    }
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }, [selected])

  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: '-price', limit: 1 })
    if (response.success) setBestPrice(response.products[0]?.price)
  }

  useEffect(() => {
    if (type === 'input') fetchBestPriceProduct()
  }, [type])

  useEffect(() => {
    if (price.from && price.to && price.from > price.to) alert('price from > to')
  }, [price])


  const debouncePriceFrom = useDebounce(price.from, 500)
  const debouncePriceTo = useDebounce(price.to, 500)
  useEffect(() => {
    let param = []
    for (const i of params.entries()) param.push(i)
    const queries = {}
    for (let i of param) queries[i[0]] = i[1]

    if (Number(price.from) > 0) queries.from = price.from
    else delete queries.from
    if (Number(price.to) > 0) queries.to = price.to
    else delete queries.to
    queries.page = 1

    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
  }, [debouncePriceFrom, debouncePriceTo])

  return (
    <div
      className='cursor-pointer p-3 text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'
      onClick={() => changeActiveFilter(name)}
    >
      <span className='capitalize'>{name}</span>
      <AiOutlineDown />
      {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
        {type === 'checkbox' && <div className=''>
          <div className='p-4 items-center flex justify-between gap-8 border-b'>
            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setSelected([])
              changeActiveFilter(null)
            }} className='underline cursor-pointer hover:text-main'>Rest</span>
          </div>
          <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
            {colors.map((el, index) => (
              <div key={index} className='flex items-center gap-4'>
                <input
                  type="checkbox"
                  value={el}
                  onChange={handleSelect}
                  id={el}
                  checked={selected.some(selectedItem => selectedItem === el)}
                />
                <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
              </div>
            ))}
          </div>
        </div>}
        {type === 'input' && <div onClick={e => e.stopPropagation()}>
          <div className='p-4 items-center flex justify-between gap-8 border-b'>
            <span className='whitespace-nowrap'>{`the highest ${Number(bestPrice).toLocaleString()} VND`}</span>
            <span onClick={e => {
              e.stopPropagation()
              setPrice({ from: '', to: '' })
              changeActiveFilter(null)
            }} className='underline cursor-pointer hover:text-main'>Rest</span>
          </div>
          <div className='flex items-center p-2 gap-2'>
            <div className='flex items-center gap-2'>
              <label htmlFor="from">From</label>
              <input
                className='from-input'
                type="number"
                id='from'
                value={price.from}
                onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor="to">To</label>
              <input
                className='from-input'
                type="number"
                id='to'
                value={price.to}
                onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>
        </div>}
      </div>}
    </div>
  )
}

export default memo(SearchItem)