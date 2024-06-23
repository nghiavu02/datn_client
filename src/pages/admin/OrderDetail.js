import React from 'react';

const OrderDetail = ({ viewOrder, setViewOrder }) => {
  // Xử lý sự kiện đóng trang chi tiết đơn hàng
  console.log(viewOrder, setViewOrder);
  const handleClose = () => {
    setViewOrder(null);
  };

  return (
    <div className='p-4 rounded h-full bg-gray-100'>
      <h2 className='text-2xl font-bold mb-4'>Order Detail</h2>
      <div className='mb-4'>
        <strong>Order ID:</strong> {viewOrder.orderId}
      </div>
      <div className='mb-4'>
        <strong>Customer Name:</strong> {viewOrder.customerName}
      </div>
      <div className='mb-4'>
        <strong>Shipping Address:</strong> {viewOrder.shippingAddress}
      </div>
      <div className='mb-4'>
        <strong>Total Amount:</strong> {viewOrder.totalAmount}
      </div>
      <div className='mb-4'>
        <strong>Status:</strong> {viewOrder.status}
      </div>
      
      {/* Thêm các trường khác của đơn hàng tại đây */}
      
      <button className='bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded' onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default OrderDetail;