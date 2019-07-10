import store from "../store";
import * as api from "../common/vmeitime-http";

export const wechatLogin = () =>
  new Promise((resolve, reject) => {
    const provider = "weixin";
    uni.showLoading();
    uni.login({
      provider,
      success: loginRes => {
        console.log(loginRes);
        uni.getUserInfo({
          provider,
          lang: "zh_CN",
          success: async userData => {
            // console.log(userData);
            try {
              const res = await api.wechatLogin({
                code: loginRes.code,
                encryptedData: userData.encryptedData,
                iv: userData.iv
              });
              stroreUser(res.data);
              resolve(res);
            } catch (err) {
              uni.showToast({
                title: "登录失败",
                icon: "none"
              });
              reject(err);
            }
            uni.hideLoading();
          },
          fail(err) {
            uni.hideLoading();
            reject(err);
          }
        });
      },
      fail(err) {
        uni.hideLoading();
        reject(err);
      }
    });
  });

export const stroreUser = ({ user, token, session_key } = {}) => {
  try {
    store.state.auth.user = user;
    store.state.auth.token = token;
    store.state.auth.session_key = session_key;
    store.state.auth.showLogin = false;
    uni.setStorage({
      key: "token",
      data: token
    });
  } catch (e) {
    console.error(e);
  }
};

export const handlePayment = paymentData =>
  new Promise((resolve, reject) => {
    uni.showLoading();
    uni.requestPayment({
      signType: "MD5",
      ...paymentData,
      success: res => {
        console.log(res);
        resolve({ ...res, ...paymentData });
      },
      fail: res => {
        console.log(res);
        reject(res);
      },
      complete() {
        uni.hideLoading();
      }
    });
  });
