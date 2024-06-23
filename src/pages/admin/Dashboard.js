import { apiGetOrders, apiGetProducts, apiGetUsers } from "apis";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [countOrder, setCountOrder] = useState([]);
  const [countUser, setCountUser] = useState([]);
  const [countProduct, setCountProduct] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  console.log(startDate, endDate);
  const handleThongke = async (event) => {
    const responseOrder = await apiGetOrders();
    const responseProduct = await apiGetProducts({ limit: 100 });
    const responseUser = await apiGetUsers({ limit: 100 });
    const getProducts = responseProduct.products;
    const getOrders = responseOrder.orders;
    const getUser = responseUser.users;
    const filterList = (list, set) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filteredOrders = list.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= start && createdAt <= end;
      });
      set(filteredOrders);
    };
    filterList(getOrders, setCountOrder);
    filterList(getProducts, setCountProduct);
    filterList(getUser, setCountUser);

    // filterList(getOrders, setCountOrder);
    // filterList()
    console.log(countOrder);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Gọi hàm API hoặc thực hiện các thao tác khác khi submit khoảng thời gian
  };
  const fetchApi = async (params) => {
    const response = await apiGetOrders({
      limit: 100,
    });
    const getUser = await apiGetUsers({ limit: 100 });
    const getProduct = await apiGetProducts({ limit: 100 });
    let sumTotal = 0;
    response.orders.map((item) => {
      sumTotal += item.total;
    });
    setTotalMoney(sumTotal);
    setCountOrder(response.orders);
    setCountUser(getUser.users);
    setCountProduct(getProduct.products);
  };
  console.log(countOrder);

  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <div className="p-5">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-10">
          <div className="flex items-center mb-2">
            <label htmlFor="start-date" className="mr-2">
              Từ ngày:
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-2">
            <label htmlFor="end-date" className="mr-2">
              Đến ngày:
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-500 text-white mt-5"
          onClick={handleThongke}
        >
          Thống kê
        </button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-medium mb-2">Người dùng</h2>
          <p className="text-3xl font-[600]">{countUser.length || 0}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-medium mb-2">Doanh thu</h2>
          <p className="text-3xl font-[600]">
            $
            {countOrder.reduce((toal, value) => {
              return toal + value.total;
            }, 0) || 0}
          </p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-medium mb-2">Tổng số đơn hàng</h2>
          <p className="text-3xl font-[600]">{countOrder.length || 0}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-medium mb-2">Số sản phẩm</h2>
          <p className="text-3xl font-[600]">{countProduct.length || 0}</p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
