import http from "./interface";
import _ from "lodash";
import store from "../../store";

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 *
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const test = data => {
  /* http.config.baseUrl = "http://localhost:8080/api/"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
  //设置请求结束后拦截器

  return http.request({
    baseUrl: "https://ls-coupon.codeispoetry.tech/wp-json/v1",
    url: "ajax/echo/text?name=uni-app",
    dataType: "text",
    data
  });
};

http.interceptor.request = config => {
  const token = _.get(store, "state.auth.token");
  if (token) {
    config.header = {
      Authorization: token
    };
  }

  return config;
};

http.interceptor.response = response => {
  console.log("response:", response);
  //判断返回状态 执行相应操作
  if (!response.statusCode || response.statusCode !== 200) {
    uni.showToast({
      icon: "none",
      title: _.get(response, "data.message") || response.errMsg
    });
  }
  return response;
};

// 轮播图
export const banner = data => {
  return http.request({
    url: "/banner/36kr",
    method: "GET",
    data
    // handle:true
  });
};

export const wechatLogin = ({ code, encryptedData, iv }) => {
  return http.request({
    url: `/wechat/login`,
    method: "POST",
    dataType: "json",
    data: {
      code,
      encryptedData,
      iv
    }
  });
};

export const wechatDecrypt = ({ session_key, encryptedData, iv }) => {
  return http.request({
    url: `/wechat/decrypt`,
    method: "POST",
    dataType: "json",
    data: {
      session_key,
      encryptedData,
      iv
    }
  });
};

export const updateUser = ({ userId, data }) => {
  return http.request({
    url: `/user/${userId}`,
    method: "PUT",
    dataType: "json",
    data
  });
};

export const getStores = () => {
  return http.request({
    url: `/store`,
    method: "GET"
  });
};

export const createBooking = ({ store, type, date, hours, checkInAt, membersCount, socksCount }) => {
  const data = _.omitBy({ store, type, date, hours, checkInAt, membersCount, socksCount }, !_.isNil);
  return http.request({
    url: `/booking`,
    method: "POST",
    dataType: "json",
    data
  });
};

export const userDeposit = ({ depositLevel }) => {
  return http.request({
    url: `/user-deposit`,
    method: "POST",
    dataType: "json",
    data: {
      depositLevel
    }
  });
};
