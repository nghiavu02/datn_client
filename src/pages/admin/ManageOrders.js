import React, { useCallback, useEffect, useState } from "react";
import {apiDeleteOrder,apiGetOrders,apiUpdateOrder,apiUpdateStatus,
} from "apis";
import moment from "moment";
import { InputField, Pagination, Select, Button } from "components";
import useDebounce from "hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import clsx from "clsx";
import Swal from "sweetalert2";
import { chuyenDinhDangSoTien, fotmatPrice } from "ultils/helpers";
// import OrderDetail from "./OrderDetail";

const ManageOrder = () => {
  
  const {handleSubmit,register,formState: { errors },} = useForm({orderId: "",buyer: "",orderDate: "",status: "",});
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [queries, setQueries] = useState({q: "",});
  const [editElm, setEditElm] = useState(null);
  const [params] = useSearchParams();
  const [update, setUpdate] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State for selected order ID
  const queriesDebounce = useDebounce(queries.q, 800);
  const [viewOrder, setViewOrder] = useState(null);
  const [show, setShow] = useState(false)
  const fetchOrders = async (params) => {
    const response = await apiGetOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setOrders(response);
    console.log(response);
  };
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchOrders(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdateOrder(data, editElm._id);
    if (response.success) {
      setEditElm(null);
      render();
      toast.success(response.mes);
    } else toast.error(response.mes);
  };
  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready to remove this order?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteOrder(orderId);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else toast.error(response.mes);
      }
    });
  };
  const handleUpdateStatus = (orderId, data, title) => {
    // setShow(prev => !prev)
    Swal.fire({
      title: "Xác nhận...",
      text: title,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiUpdateStatus( {status: data}, orderId);
        console.log(response);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else toast.error(response.mes);
      }
    });
  }
  return (
    <div className="w-full flex flex-col gap-4 relative">
{viewOrder && (
  <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
    <OrderDetail
      viewOrder={viewOrder}
      setViewOrder={setViewOrder}
    />
  </div>
)}
    <div className={clsx("w-full", editElm && "pl-16")}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Quản lý đơn hàng</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-end py-4">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w500"}
            placeholder="Tìm kiếm mã đơn hàng hoặc người mua..."
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)} >
          {editElm && <Button type="submit">Cập nhật</Button>}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[13px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Mã đơn hàng</th>
                <th className="px-4 py-2">Người mua</th>
                <th className="px-4 py-2">Ngày đặt</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className=" py-2">Chi tiết đơn hàng</th>
                <th className=" py-2">Duyệt đơn</th>
                <th className=" py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders?.orders?.map((order, index) => (
                <tr key={order?._id} className="border border-gray-500">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{order?._id || "daf"}</td>
                  <td className="py-2 px-4">
                    {order?.orderBy
                      ? order?.orderBy?.lastname +
                        " " +
                        order?.orderBy?.firstname
                      : ""}
                  </td>
                  <td className="py-2 px-4">
                    {moment(order?.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">
                      <span className="px-2">
                      {order?.status === 'Processing' ? 'Chờ xử lý' : order?.status === 'Succeed' ? 'Đã duyệt' : 'Hủy bỏ'}
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                     onClick={() => setViewOrder(order)}
                      className="px-2 text-orange-600 hover:underline cursor-pointer"
                    > Chi tiết</span>
                  </td>
                  <td className="py-2">
                  <div className="flex gap-2">
                  <span
                      onClick={() => handleUpdateStatus(order._id, 'Succeed', 'Bạn có chắc chắn xác nhận duyệt đơn hàng?')}
                      className="bg-green-700 hover:bg-green-600 text-white font-[500] py-2 px-4 rounded cursor-pointer"
                    > Duyệt đơn</span>
                  <span
                      onClick={() => handleUpdateStatus(order._id, 'Cancelled', 'Bạn có chắc chắn xác nhận hủy đơn hàng?')}
                      className=" text-red-700 bg-red-500 hover:bg-red-600 hover:opacity-50 text-[#ffff] font-[500] py-2 px-4 rounded cursor-pointer"
                    > Hủy bỏ</span>
                  </div>

                    
                  </td>
                  <td className="py-2 px-4">
                  <span
                      onClick={() => handleDeleteOrder(order?._id)}
                      className="px-2 text-orange-600 hover:underline cursor-pointer"
                    > Xóa</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalCount={orders?.counts}
            onChange={(page) => setQueries({ ...queries, page })}
          />
        </form>
       
      </div>
    </div>
    </div>
  );
};
export default ManageOrder;


const OrderDetail = ({ viewOrder, setViewOrder }) => {
  // Xử lý sự kiện đóng trang chi tiết đơn hàng
  const handleClose = () => {
    setViewOrder(null);
  };
  let sum = 0
  const totalMoney = ()=>  viewOrder.products.map(item => {
    sum += item.price* item.quantity
  })  
  totalMoney()
  
  return (
    <div className='p-4 rounded h-full bg-gray-100 ml-4'>
      <h2 className='text-2xl font-bold mb-10 text-[30px] text-center p-5'>Chi tiết đơn hàng</h2>
      <div className="mb-4">
      <span className="font-[600] mr-2">
      Mã đơn hàng:
      </span>
      {viewOrder?._id}</div> 
      <div className='mb-4 flex gap-10'>
      {/* <div>Mã Khách hàng: {viewOrder?.orderBy?._id}</div> */}
      <div><span className="font-[600]">Tên khách hàng:</span> {viewOrder?.orderBy?.lastname+ " " + viewOrder?.orderBy?.firstname}</div>
      </div>
      <div className='mb-4'>
      <span className="font-[600] mr-2">
      Số điện thoại:
      </span>
        {viewOrder?.orderBy?.mobile}
      </div>
      
      <div className='mb-4'>
      <span className="font-[600] mr-2">Email:</span>
         {viewOrder?.orderBy?.email}
      </div>
      {/* <div className='mb-4'>
        Thành tiền: {viewOrder.total} USD
      </div> */}
      
      <div className='mb-4'>
      <span className="font-[600] mr-2">Ngày tạo đơn: </span>
        {moment(viewOrder.createdAt).format('DD/MM/YYYY')}
      </div>
      <div className='mb-4'>
      <span className="font-[600] mr-2">
      Địa chỉ:
      </span>
         {viewOrder?.orderBy?.address}
      </div>
      <div className='mb-4'>
      <span className="font-[600] mr-2">
       Trạng thái:
      </span>
      <span className={`${viewOrder.status=== 'Succeed' ? 'text-red-500': 'text-green-500'}`}>
        {viewOrder.status === 'Succeed' ? 'Đang xử lý' : 'Đã duyệt'}
      </span>
      </div>
      <div>
      <table className="table-auto mb-6 text-left w-full" align="center" >
            <thead className="font-bold bg-gray-700 text-[13px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Tên sản phẩm</th>
                <th className="px-4 py-2">Ảnh</th>
                <th className="px-4 py-2">Màu sắc</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className=" py-2">Giá tiền(VND)</th>
                {/* <th className=" py-2">Thao tác</th> */}
              </tr>
            </thead>
            <tbody>
              {viewOrder?.products?.map((item, index) => (
                <tr key={item?._id} className="border border-gray-500">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                  {item?.title}
                  </td>
                  <td className="py-2 px-4">
                  <img src={item?.thumbnail} alt="thumb" className='w-12 h-12 object-cover' />
                  </td>
                  <td className="py-2 px-4">
                    {item?.color}
                  </td>
                  <td className="py-2 px-4">
             
                    {item?.quantity}
                  </td>
                  <td className="py-2 px-4">
                    {chuyenDinhDangSoTien(item.price)}
                  </td>
                </tr>
              ))}
              <tr className="border border-gray-500">
                <td className="py-4 px-4">Thành tiền</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={'5'}>{chuyenDinhDangSoTien(sum)}</td>
              </tr>
            </tbody>
          </table>
      </div>
      <button className='bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded' onClick={handleClose}>
        Close
      </button>
    </div>
  );
};


