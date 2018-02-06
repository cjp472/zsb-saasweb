import { routerRedux } from 'dva/router';
//下面公共布局
export default {

  namespace: 'commonLayoutModel',

  state: {
      width: 150,  // 展开时宽度
      collapsedWidth: 150,  //收缩时宽度
      collapsed: false, //收缩状态
  },

  reducers: {

      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

  },

}
