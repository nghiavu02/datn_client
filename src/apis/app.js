import axios from "../axios"

export const apiGetCategories = () => axios({
  url: '/productcategory',
  method: 'get'
})