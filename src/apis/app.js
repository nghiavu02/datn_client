import axios from "../axios";

export const apiGetCategories = () =>
  axios({
    url: "/productcategory",
    method: "get",
  });

export const apiDeleteCategory = (pid) =>
  axios({
    url: "/productcategory/" + pid,
    method: "delete",
  });
