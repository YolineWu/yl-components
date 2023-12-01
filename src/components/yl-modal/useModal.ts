import { Module, Store } from "vuex";

/** 按“返回键”键和顶部导航栏左边的返回按钮返回时对应的操作 */
export enum BackActionType {
  DISABLED = "disabled",
  CLOSEMODAL = "closeModal",
  DEFAULT = "default",
}

/** yl-modal 组件数据选项 */
export type YLModalOptions = {
  /** modal框标题，默认为空字符串 */
  title?: string;
  /** modal框主内容，默认为空字符串 */
  content?: string;
  /** modal框内容下面的次要内容，默认为空字符串 */
  desc?: string;
  /** 取消按钮文本，默认为 `取消` */
  cancelText?: string;
  /** 确认按钮文本，默认为 `确认` */
  confirmText?: string;
  /**
   * 点击取消按钮时的回调（会先调用此回调再调用组件的 `@confirm` 事件回调），当返回true时表示
   * 阻止关闭模态框
   */
  onCancel?: () => boolean | void;
  /**
   * 点击确认按钮时的回调（会先调用此回调再调用组件的 `@confirm` 事件回调），当返回true时表示
   * 阻止关闭模态框
   */
  onConfirm?: () => boolean | void;
  /** 点击模态框外的区域时是否关闭，默认为 `false` */
  closeOnClickMask?: boolean;
  /** 页面 `onHide` 时是否关闭模态框，默认为 `false` */
  closeOnHide?: boolean;
  /** 页面 `onUnload` 时是否关闭模态框，默认为 `true` */
  closeOnUnload?: boolean;
  /**
   * 是否阻止“返回键”键和顶部导航栏左边的返回按钮返回，
   * 默认为 {@link BackActionType.DISABLED}
   */
  backAction?: BackActionType;
};

/** yl-modal组件数据 */
export type YLModalData = {
  [key in keyof YLModalOptions]-?: YLModalOptions[key];
};

/** yl-modal的store状态数据 */
export type YLModalState = {
  /** 是否正在显示 */
  show: boolean;
  /** 当前 `yl-modal` 所在页面的状态 */
  pageState: YLModalPageState;
  /** `yl-modal` 组件内容数据 */
  data: YLModalData;
};

/** 显示状态改变回调 */
export type YLModalShowCallback = (isShow: boolean) => void;
/** 数据内容变化回调 */
export type YLModalDataCallBack = (data: YLModalData) => void;

/** `yl-modal` 组件 */
export type YLModalController = {
  /**
   * 显示组件，如果组件已经在显示，则会修改当前组件数据
   * @param data 要显示的组件内容数据
   * @param reset 组件正在显示时再次调用此方法，是否重置组件
   * 内容数据到默认值 {@link DEFAULT_YL_MODAL_OPTIONS} ，再
   * 加载参数 `data` 的值
   */
  show(data: YLModalOptions, reset?: boolean): YLModalData;
  /** 关闭显示组件 */
  close(): void;
  /** 组件是否显示正在显示 */
  isShow(): boolean;
  /** 组件显示状态发生变化时调用传进来的回调，此方法返回取消注册当前回调的方法 */
  onShowChange(callback: YLModalShowCallback): () => void;
  /** 组件内容数据发生变化时调用传进来的回调，此方法返回取消注册当前回调的方法 */
  onDataChange(callback: YLModalDataCallBack): () => void;
  /** 获取组件状态数据 */
  getModalState(): YLModalState;
};

export type YLModalListener<
  CB extends YLModalShowCallback | YLModalDataCallBack,
> = {
  storePath: string;
  callback: CB;
  id: number;
};

/** 显示状态监听器 */
export type YLModalShowListener = YLModalListener<YLModalShowCallback>;

/** 内容数据变化监听器 */
export type YLModalDataListener = YLModalListener<YLModalDataCallBack>;

/** `yl-modal` 所在页面的状态 */
export enum YLModalPageState {
  LOAD = "onLoad",
  SHOWED = "onShow",
  HIDED = "onHide",
  UNLOAD = "onUnload",
  UNKNOW = "unknow",
}

/** 控制 `yl-modal` 组件的默认 Vuex store 模组路径名 */
export const DEFAULT_YL_MODAL_STORE_PATH = "YLModalPath";

/** yl-modal组件选项默认值 */
export const DEFAULT_YL_MODAL_OPTIONS: YLModalData = {
  title: "",
  content: "",
  desc: "",
  cancelText: "取消",
  confirmText: "确定",
  onCancel: () => {},
  onConfirm: () => {},
  closeOnClickMask: false,
  closeOnHide: false,
  closeOnUnload: true,
  backAction: BackActionType.DISABLED,
};

/** `yl-modal` 组件的事件 */
export enum YLModalEvent {
  CANCEL = "cancel",
  CONFIRM = "confirm",
  CLICK_MASK = "clickMask",
  CLOSE = "close",
  PAGE_STATE_CHANGE = "pageStateChange",
}

// 监听器ID累加器
let listenerId = 1;

// 显示状态监听器
const showListeners: YLModalShowListener[] = [];
// 数据变化监听器
const dataListeners: YLModalDataListener[] = [];

enum Mutaion {
  SET_SHOW = "setShow",
  SET_DATA = "setData",
  SET_PAGE_STATE = "setPageState",
}

/** vuex store模组定义 */
function defineStoreModule(modalData: YLModalData): Module<YLModalState, any> {
  return {
    namespaced: true,
    state: {
      show: false,
      pageState: YLModalPageState.UNKNOW,
      data: modalData,
    },
    mutations: {
      [Mutaion.SET_SHOW](state: YLModalState, isShow: boolean) {
        state.show = isShow;
        showListeners.forEach((listener) => listener.callback(isShow));
      },
      [Mutaion.SET_DATA](state: YLModalState, data: YLModalData) {
        state.data = data;
        dataListeners.forEach((listener) => listener.callback(data));
      },
      [Mutaion.SET_PAGE_STATE](
        state: YLModalState,
        pageState: YLModalPageState,
      ) {
        state.pageState = pageState;
      },
    },
    actions: {
      [YLModalEvent.CONFIRM]({ commit, state }) {
        const stopClose =
          typeof state.data.onConfirm === "function"
            ? state.data.onConfirm()
            : false;
        if (!stopClose) commit(Mutaion.SET_SHOW, false);
      },
      [YLModalEvent.CANCEL]({ commit, state }) {
        const stopClose =
          typeof state.data.onCancel === "function"
            ? state.data.onCancel()
            : false;
        if (!stopClose) commit(Mutaion.SET_SHOW, false);
      },
      [YLModalEvent.CLICK_MASK]({ commit, state }) {
        if (state.data.closeOnClickMask) commit(Mutaion.SET_SHOW, false);
      },
      [YLModalEvent.CLOSE]({ commit }) {
        commit(Mutaion.SET_SHOW, false);
      },
      [YLModalEvent.PAGE_STATE_CHANGE](
        { commit, state },
        pageState: YLModalPageState,
      ) {
        commit(Mutaion.SET_PAGE_STATE, pageState);
        if (
          state.show &&
          pageState === YLModalPageState.HIDED &&
          state.data.closeOnHide
        )
          commit(Mutaion.SET_SHOW, false);
        if (
          state.show &&
          pageState === YLModalPageState.UNLOAD &&
          state.data.closeOnUnload
        )
          commit(Mutaion.SET_SHOW, false);
      },
    },
  };
}

/** 监听器注册 */
function onChange<CB extends YLModalShowCallback | YLModalDataCallBack>(
  callback: CB,
  listeners: YLModalListener<CB>[],
  storePath: string,
): () => void {
  let id = listenerId++;
  const listener: YLModalListener<CB> = { storePath, callback, id };
  listeners.push(listener);
  return () => {
    const indexToDel = listeners.findIndex(
      (value: YLModalListener<CB>) => value.id === id,
    );
    if (indexToDel !== -1) listeners.splice(indexToDel, 1);
  };
}

/** 如果 `yl-modal` 对应的store还没有注册，这注册 */
export function registerStoreIfNo(
  store: Store<any>,
  storePath: string,
  modalData: YLModalData,
) {
  if (!store.hasModule(storePath))
    store.registerModule<YLModalState>(storePath, defineStoreModule(modalData));
}

/** 使用 `yl-modal` 组件 */
export function useYLModal(
  store: Store<any>,
  storePath: string = DEFAULT_YL_MODAL_STORE_PATH,
  options: YLModalOptions = {},
): YLModalController {
  // 合并选项 `options`
  const defModalData: YLModalData = DEFAULT_YL_MODAL_OPTIONS;
  Object.typedKeys(options).forEach((key) => {
    // @ts-expect-error
    if (options[key] !== undefined) defModalData[key] = options[key];
  });

  // 检查如果没有对应 `storePath` 的 store 模组，则手动注册
  registerStoreIfNo(store, storePath, defModalData);

  // 当前 store 模组的 `state`
  function getModalState(): YLModalState {
    return store.state[storePath];
  }

  return {
    getModalState,
    isShow: () => getModalState().show,
    show(data: YLModalOptions, reset: boolean = false): YLModalData {
      const modalState = getModalState();
      if (modalState.pageState === YLModalPageState.UNLOAD)
        return modalState.data;
      const resultData: YLModalData = {
        ...(reset ? defModalData : modalState.data),
        ...data,
      };
      store.commit(`${storePath}/${Mutaion.SET_DATA}`, resultData);
      store.commit(`${storePath}/${Mutaion.SET_SHOW}`, true);
      return resultData;
    },
    close() {
      store.commit(`${storePath}/${Mutaion.SET_SHOW}`, false);
    },
    onShowChange(callback: YLModalShowCallback): () => void {
      return onChange(callback, showListeners, storePath);
    },
    onDataChange(callback: YLModalDataCallBack): () => void {
      return onChange(callback, dataListeners, storePath);
    },
  };
}
