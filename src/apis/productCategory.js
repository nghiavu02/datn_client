import axios from "../axios";

// export const apiGetCategories = (params) =>
//   axios({
//     url: "/productcategory",
//     method: "get",
//     params,
//   });
// export const apiDeleteCategory = (pid) =>
//   axios({
//     url: "/productcategory/" + pid,
//     method: "delete",
//   });
export const apiCreateProductCategory = async (data) => {
  try {
    const response = await axios({
      url: "/productcategory",
      method: "post",
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product category:", error);
    throw error;
  }
};
