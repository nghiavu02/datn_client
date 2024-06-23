import React, { memo, useState } from 'react'
import { formatMoney, renderStarFromNumber } from 'ultils/helpers'
import trending from 'assets/trending.png'
import label from 'assets/new.png'
import SelectOption from 'components/search/SelectOption'
import icons from 'ultils/icons'
import { Link, createSearchParams } from "react-router-dom";
import withBaseComponent from 'hocs/withBaseComponent'
import { showModal } from 'store/app/appSlice'
import { DetailProduct } from 'pages/public'
import { apiUpdateCart, apiUpdateWishlist } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'ultils/path'
import { BsFillCartCheckFill, BsFillCartPlusFill } from 'react-icons/bs'
import clsx from 'clsx'

const { AiFillEye, BsCartPlus, BsFillSuitHeartFill } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch, location, pid, className }) => {
  const [iShowOption, setIShowOption] = useState(false)
  const { current } = useSelector(state => state.user)
  const handleClickOptions = async (e, flag) => {
    e.stopPropagation()
    if (flag === 'CART') {
      if (!current) return Swal.fire({
        title: 'Almost...',
        text: 'please login',
        icon: 'info',
        cancelButtonText: 'Not now!',
        showCancelButton: true,
        confirmButtonText: 'GO login'
      }).then((rs) => {
        if (rs.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({ redirect: location.pathname }).toString()
        })
      })
      const response = await apiUpdateCart({
        pid: productData?._id,
        color: productData?.color,
        quantity: 1,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title,
      })
      if (response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      }
      else toast.error(response.mes)
    }
    if (flag === 'WISHLIST') {
      const response = await apiUpdateWishlist(pid)
      if (response.success) {
        dispatch(getCurrent())
        toast.success(response.mes)
      } else toast.error(response.mes)
    }
    if (flag === 'QUICK_VIEW') {
      dispatch(showModal({ isShowModal: true, modalChildren: <DetailProduct  data={{ pid: productData?._id, category: productData?.category }} isQuickView /> }))
    }
  }
  return (
    <div className={clsx('w-full text-base px-[10px]', className)}>
      <div
        onMouseEnter={e => {
          e.stopPropagation()
          setIShowOption(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIShowOption(false)
        }}
        className='w-full border p-[15px] flex flex-col items-center'
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData.title}`)}
      >
        <div className='w-full relative'>
          {iShowOption && <div className='absolute bottom-[-10px] flex left-0 right-0 justify-center gap-2 animate-slide-top'>
            <span title='Quick view' onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}><SelectOption icons={<AiFillEye />} /></span>
            {current?.cart?.some(el => el.product === productData._id.toString())
              ? <span title='Added to cart'><SelectOption icons={<BsFillCartCheckFill color='green' />} /></span>
              : <span title='Add to cart' onClick={(e) => handleClickOptions(e, 'CART')}><SelectOption icons={<BsFillCartPlusFill />} /></span>}
            <span title='Add wishlist' onClick={(e) => handleClickOptions(e, 'WISHLIST')}><SelectOption icons={<BsFillSuitHeartFill color={current?.wishlist?.some(i => i._id === pid) ? 'red' : 'gray'} />} /></span>
          </div>}
          <img
            src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
            alt=""
            className='w-[274px] h-[274px] object-cover'
          />
          {!normal && <img src={isNew ? label : trending} alt="" className={`absolute w-[100px] h-[35px] top-0 right-0 object-cover`} />}
        </div>
        <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Product))