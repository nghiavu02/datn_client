import { apiDeleteCategory, apiGetCategories } from "apis";
import { apiCreateProductCategory } from "apis/productCategory";
import { Pagination } from "components";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const ManageCategories = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [showImage, setShowImage] = useState()
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [counts, setCounts] = useState(0);
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "brand",
  });
  const fetchCategories = async () => {
    const response = await apiGetCategories({
      //   limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setCategories(response.categories);
    }
    // console.log(response);
  };

  useEffect(() => {
    fetchCategories();
  }, [update]);

  const handleDeleteCategory = (categoryId) => {
    console.log(categoryId);
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteCategory(categoryId);
        if (response.success) {
          toast.success("Xóa thành công");
          render();
        } else {
          toast.error("Thất bại");
        }
      }
    });
  };

  const onSubmit = (data) => {
    // Xử lý logic khi gửi biểu mẫu
    console.log(data);
  };
  const onSubmit1 = async (data) => {
    console.log(data);
    const { image } = data;
    let img = image[0].name;
    console.log(img);
    try {
      console.log(data.image[0]);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image[0]);
      // formData.append("thumb", finalPayload.thumb[0]);

      const rs = await apiCreateProductCategory(formData);

      toast.success("Thêm mới thành công");
      render();
      reset({ title: "", description: "", image: "", brand: [] });

      // reset();
      // Handle successful creation, e.g., close the form, show a success message, etc.
    } catch (error) {
      // Handle error, e.g., display an error message
      console.error("Error creating product category:", error);
    }
  };
  // console.log(categories);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };
  return (
    <div>
      <div className="border-b w-full bg-gray-100 flex justify-between items-center   p-4">
        <h1 className="text-3xl font-[600] tracking-tight">
          Danh mục sản phẩm
        </h1>
      </div>
      <div className="flex w-full justify-end items-center px-4 mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowCreateForm(true)}
        >
          + Thêm mới
        </button>
      </div>
      {showCreateForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50 ">
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[800px] py-8 px-16 "
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 className="text-2xl font-bold mb-4">Thêm mới danh mục</h2>
            <form onSubmit={handleSubmit(onSubmit1)}>
              <div className="mb-4">
                <label htmlFor="title" className="block font-bold mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="title"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  {...register("title", { required: true })}
                />
                {errors.title && (
                  <p className="text-red-500 mt-2">
                    Vui lòng nhập tên danh mục.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand" className="block font-bold mb-2">
                  Thương hiệu
                </label>
                <div>
                  {fields.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        id={`brand-${index}`}
                        className="border border-gray-300 rounded-md px-4 py-2 flex-grow mr-2"
                        {...register(`brand.${index}`, { required: true })}
                      />
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => remove(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => append("")}
                  >
                    Thêm thương hiệu
                  </button>
                </div>
                {errors.brand && (
                  <p className="text-red-500 mt-2">
                    Vui lòng nhập ít nhất một thương hiệu.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block font-bold mb-2">
                  Ảnh
                </label>
                <input
                  type="file"
                  id="image"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  {...register("image", { required: true })}
                  accept="image/*"
                  maxLength={1}
                  onChange={handleImageUpload}
                />
                {errors.image && (
                  <p className="text-red-500 mt-2">Vui lòng chọn một ảnh.</p>
                )}
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="mt-4 max-w-xs"
                  />
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block font-bold mb-2">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  {...register("description")}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                  onClick={() => setShowCreateForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="w-full flex flex-col gap-4 relative p-4">
        <div className="flex w-full justify-end items-center px-4 mt-5">
          <form className="w-[45%]" onSubmit={handleSubmit(onSubmit)}>
            {/* <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            placeholder="Search categories..."
            {...register("search")}
          /> */}
          </form>
        </div>
        <table className="table-auto mb-6 text-left w-full">
          <thead>
            <tr className="border bg-sky-900 text-white border-white align-middle">
              <th className="text-center py-2">#</th>
              <th className="text-center py-2">Ảnh</th>
              <th className="text-center py-2">Tên danh mục</th>
              <th className="text-center py-2">Mô tả</th>
              <th className="text-center py-2"></th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category, index) => (
              <tr className="border-b" key={category?.id}>
                <td className="text-center py-2">{index + 1}</td>
                <td className="text-center py-2 flex justify-center">
                  <img
                    src={category.image}
                    alt="thumb"
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="text-center py-2">{category.title}</td>
                <td className="py-2 max-w-[160px] ">{category.description}</td>
                <td className="text-center py-2">
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full flex justify-end my-8">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
