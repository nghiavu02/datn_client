import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../../apis/product";
import { CustomSlider } from "..";
import { getNewProducts } from "../../store/products/asynsActions";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
  // { id: 3, name: 'tablets' },
];

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);
  const { isShowModal } = useSelector((state) => state.app);

  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: "-order" });
    if (response?.success) {
      setBestSellers(response?.products);
      setProducts(response?.products);
    }
  };

  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);

  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);

  return (
    <div className={clsx(isShowModal ? "hidden" : "")}>
      <div className="flex text-[20px] ml-[-32px]">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`cursor-pointer font-semibold uppercase px-8 border-r text-gray-400 ${
              activedTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
        <CustomSlider products={products} activedTab={activedTab} />
      </div>
      <div className="w-full flex gap-4 mt-4">
        <img
          className="flex-1 object-contain"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
        />
        <img
          className="flex-1 object-contain"
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
        />
      </div>
    </div>
  );
};

export default BestSeller;
