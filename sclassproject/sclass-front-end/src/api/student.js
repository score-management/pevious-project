import axios from '@/libs/api.request'

import {
  parseFuncObj,
  disableFormItems
} from "@/libs/util.js"
import {
  resolve
} from 'path';





// 获取动态档案类型分类

export const getDynamicArchiveType = () => {
  return axios.request({
    url: '/common/get_dynamic_forms_cate',
    method: 'get'
  })
}

export const getDynamicArchiveArch = (form_arch_id) => {
  return axios.request({
    url: '/common/get_dynamic_form_arch/' + form_arch_id,
    method: 'get'
  }).then((res) => {
    return new Promise(function (resolve, reject) {
      console.log(res)
      res.data.form_arch = parseFuncObj(res.data.formArch);
      res.data.form_arch = res.data.form_arch.options;
      resolve(res)
    })
  })
}


export const persistArchiveFormData = ({
  form_arch_id,
  form_data
}) => {
  return axios.request({
    url: '/archive',
    method: 'post',
    data: {
      form_arch_id,
      form_data
    },
  })
}

// export const uploadArchiveFile =({form_arch_id,form_data})=>{

//   })
// }


export const getArchiveList = () => {
  return axios.request({
    url: '/archive/list',
    method: 'get'
  })
}

export const getPersistArchiveList = () => {
  return axios.request({
    url: '/persist_archive/list',
    method: 'get'
  })
}


export const getArchiveById = (archive_id) => {
  return axios.request({
    url: '/archive/' + archive_id,
    method: 'get'
  }).then((res) => {
    return new Promise(function (resolve, reject) {
      console.log(res)
      res.data.form_arch = parseFuncObj(res.data.form_arch);
      res.data.form_arch = res.data.form_arch.options;
      res.data.form_content = JSON.parse(res.data.form_content)
      resolve(res)
    })
  })
}

export const getArchiveByIdDisabled = (archive_id) => {
  return axios.request({
    url: '/archive/' + archive_id,
    method: 'get'
  }).then((res) => {
    return new Promise(function (resolve, reject) {
      console.log(res)
      res.data.form_arch = disableFormItems(res.data.form_arch);
      console.log(res)
      resolve(res)
    })
  })
}



export const editArchiveById = (archive_id, {
  form_data,
  form_arch_id
}) => {
  return axios.request({
    url: '/archive/' + archive_id + '/edit',
    method: 'post',
    data: {
      form_data,
      form_arch_id
    }
  })
}

export const delArchiveById = (archive_id) => {
  return axios.request({
    url: '/archive/' + archive_id + '/delete',
    method: 'post'
  })
}


export const delFileById = (file_id) => {
  return axios.request({
    url: '/files/' + file_id + '/delete',
    method: 'post'
  })
}



export const getReviewedArchiveList = () => {
  return axios.request({
    url: '/reviewer/reviewed_archive/list',
    method: 'get'
  })
}

export const getReviewArchiveList = () => {
  return axios.request({
    url: '/reviewer/review_archive/list',
    method: 'get'
  })
}


export const getReviewList = () => {
  return axios.request({
    url: '/reviewer/review_list',
    method: 'get'
  })
}

// export const getReviewArchive = (archive_id) => {
//   return axios.request({
//     url: '/review/' + archive_id,
//     method: 'get'
//   })
// }


export const reviewArchive = (archive_id, result, note) => {
  return axios.request({
    url: '/reviewer/review/' + archive_id,
    method: 'post',
    params: {
      result: result
    },
    data: {
      note: note
    }
  })
}


export const getReviewedArchives = () => {
  return axios.request({
    url: '/reviewer/reviewed_archives',
    method: 'get',
  })
}

export const getReviewedArchiveById = (archive_id) => {
  return axios.request({
    url: '/reviewer/reviewed_archive/' + archive_id,
    method: 'get',
  })
}



export const submitArchiveStateToWait = (archive_id) => {
  return axios.request({
    url: '/archive/' + archive_id + "/wait",
    method: 'post',
  })
}
