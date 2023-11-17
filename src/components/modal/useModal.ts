import { Module, Store } from "vuex";

/** 按“返回键”键和顶部导航栏左边的返回按钮返回时对应的操作 */
export enum BackActionType {
  DISABLED = "disabled",
  CLOSEMODAL = "closeModal",
  DEFAULT = "default",
}

/** yl-modal 组件数据选项 */
export type ModalOptions = {
  /** modal框标题，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  title?: string;
  /** modal框主内容，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  content?: string;
  /** modal框内容下面的次要内容，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  desc?: string;
  /** 取消按钮文本，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  cancelText?: string;
  /** 确认按钮文本，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  confirmText?: string;
  /**
   * 点击取消按钮时的回调（会先调用此回调再调用组件的 `@cancel` 事件回调），返回值表示是否关闭模态框，
   * 如果不需要回调，可直接设置为 `boolean` 值，表示点击取消按钮后是否关闭模态框
   * 默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段
   */
  onCancel?: (() => boolean) | boolean;
  /**
   * 点击确认按钮时的回调（会先调用此回调再调用组件的 `@confirm` 事件回调），返回值表示是否关闭模态框，
   * 如果不需要回调，可直接设置为 `boolean` 值，表示点击确认按钮后是否关闭模态框
   * 默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段
   */
  onConfirm?: (() => boolean) | boolean;
  /** 点击模态框外的区域时是否关闭，默认值查看{@link DEFAULT_MODAL_OPTIONS} 的对应字段 */
  closeOnClickMask?: boolean;
  /**
   * 页面 `onHide` 时是否关闭模态框，
   * 默认值查看 {@link DEFAULT_MODAL_OPTIONS} 对应的字段
   */
  closeOnHide?: boolean;
  /**
   * 页面 `onUnload` 时是否关闭模态框，
   * 默认值查看 {@link DEFAULT_MODAL_OPTIONS} 对应的字段
   */
  closeOnUnload?: boolean;
  /**
   * 是否阻止“返回键”键和顶部导航栏左边的返回按钮返回，
   * 默认值查看 {@link DEFAULT_MODAL_OPTIONS} 对应的字段
   */
  backAction?: BackActionType;
};

/** yl-modal组件数据 */
export type ModalData = {
  [key in keyof ModalOptions]-?: ModalOptions[key];
};

/** yl-modal的store状态数据 */
export type ModalState = {
  /** 是否正在显示 */
  show: boolean;
  /** 当前 `yl-modal` 所在页面的状态 */
  pageState: ModalPageState;
  /** `yl-modal` 组件内容数据 */
  data: ModalData;
};

/** 显示状态改变回调 */
export type ShowCallback = (isShow: boolean) => void;
/** 数据内容变化回调 */
export type DataCallBack = (data: ModalData) => void;

/** `yl-modal` 组件 */
export type ModalController = {
  /**
   * 显示组件，如果组件已经在显示，则会修改当前组件数据
   * @param data 要显示的组件内容数据
   * @param reset 组件正在显示时再次调用此方法，是否重置组件
   * 内容数据到默认值 {@link DEFAULT_MODAL_OPTIONS} ，再
   * 加载参数 `data` 的值
   */
  show(data: ModalOptions, reset?: boolean): ModalData;
  /** 关闭显示组件 */
  close(): void;
  /** 组件是否显示正在显示 */
  isShow(): boolean;
  /** 组件显示状态发生变化时调用传进来的回调，此方法返回取消注册当前回调的方法 */
  onShowChange(callback: ShowCallback): () => void;
  /** 组件内容数据发生变化时调用传进来的回调，此方法返回取消注册当前回调的方法 */
  onDataChange(callback: DataCallBack): () => void;
  /** 获取组件状态数据 */
  getModalState(): ModalState;
};

export type GMListener<CB extends ShowCallback | DataCallBack> = {
  storePath: string;
  callback: CB;
  id: number;
};

/** 显示状态监听器 */
export type ShowListener = GMListener<ShowCallback>;

/** 内容数据变化监听器 */
export type DataListener = GMListener<DataCallBack>;

/** `yl-modal` 所在页面的状态 */
export enum ModalPageState {
  LOAD = "onLoad",
  SHOWED = "onShow",
  HIDED = "onHide",
  UNLOAD = "onUnload",
  UNKNOW = "unknow",
}

/** 控制 `yl-modal` 组件的默认 Vuex store 模组路径名 */
export const DEFAULT_MODAL_STORE_PATH = "YLModalPath";

/** yl-modal组件选项默认值 */
export const DEFAULT_MODAL_OPTIONS: ModalData = {
  title: "",
  content: "",
  desc: "",
  cancelText: "取消",
  confirmText: "确定",
  onCancel: true,
  onConfirm: true,
  closeOnClickMask: false,
  closeOnUnload: true,
  closeOnHide: true,
  backAction: BackActionType.DISABLED,
};

/** `yl-modal` 组件的事件 */
export enum ModalEvent {
  CANCEL = "cancel",
  CONFIRM = "confirm",
  CLICK_MASK = "clickMask",
  CLOSE = "close",
  PAGE_STATE_CHANGE = "pageStateChange",
}

// 监听器ID累加器
let listenerId = 1;

// 显示状态监听器
const showListeners: ShowListener[] = [];
// 数据变化监听器
const dataListeners: DataListener[] = [];

enum Mutaion {
  SET_SHOW = "setShow",
  SET_DATA = "setData",
  SET_PAGE_STATE = "setPageState",
}

/** vuex store模组定义 */
function defineStoreModule(modalData: ModalData): Module<ModalState, any> {
  return {
    namespaced: true,
    state: {
      show: false,
      pageState: ModalPageState.UNKNOW,
      data: DEFAULT_MODAL_OPTIONS,
    },
    mutations: {
      [Mutaion.SET_SHOW](state: ModalState, isShow: boolean) {
        state.show = isShow;
        showListeners.forEach((listener) => listener.callback(isShow));
      },
      [Mutaion.SET_DATA](state: ModalState, data: ModalData) {
        state.data = data;
        dataListeners.forEach((listener) => listener.callback(data));
      },
      [Mutaion.SET_PAGE_STATE](state: ModalState, pageState: ModalPageState) {
        state.pageState = pageState;
      },
    },
    actions: {
      [ModalEvent.CONFIRM]({ commit }) {
        const close =
          typeof modalData.onConfirm === "function"
            ? modalData.onConfirm()
            : modalData.onConfirm;
        if (close) commit(Mutaion.SET_SHOW, false);
      },
      [ModalEvent.CANCEL]({ commit }) {
        const close =
          typeof modalData.onConfirm === "function"
            ? modalData.onConfirm()
            : modalData.onConfirm;
        if (close) commit(Mutaion.SET_SHOW, false);
      },
      [ModalEvent.CLICK_MASK]({ commit }) {
        if (modalData.closeOnClickMask) commit(Mutaion.SET_SHOW, false);
      },
      [ModalEvent.CLOSE]({ commit }) {
        commit(Mutaion.SET_SHOW, false);
      },
      [ModalEvent.PAGE_STATE_CHANGE](
        { commit, state },
        pageState: ModalPageState,
      ) {
        console.log("----------- store action, pageState=", pageState);
        commit(Mutaion.SET_PAGE_STATE, pageState);
        if (
          (pageState === ModalPageState.HIDED ||
            pageState === ModalPageState.UNLOAD) &&
          state.show
        )
          commit(Mutaion.SET_SHOW, false);
      },
    },
  };
}

/** 监听器注册 */
function onChange<CB extends ShowCallback | DataCallBack>(
  callback: CB,
  listeners: GMListener<CB>[],
  storePath: string,
): () => void {
  let id = listenerId++;
  const listener: GMListener<CB> = { storePath, callback, id };
  listeners.push(listener);
  return () => {
    const indexToDel = listeners.findIndex(
      (value: GMListener<CB>) => value.id === id,
    );
    if (indexToDel !== -1) listeners.splice(indexToDel, 1);
  };
}

/** 使用 `yl-modal` 组件 */
export function useModal(
  store: Store<any>,
  storePath: string = DEFAULT_MODAL_STORE_PATH,
  options: ModalOptions = {},
): ModalController {
  // 合并选项 `options`
  const defModalData: ModalData = DEFAULT_MODAL_OPTIONS;
  Object.typedKeys(options).forEach((key) => {
    // @ts-expect-error
    if (options[key] !== undefined) defModalData[key] = options[key];
  });

  // 检查如果没有对应 `storePath` 的 store 模组，则手动注册
  if (!store.hasModule(storePath))
    store.registerModule<ModalState>(
      storePath,
      defineStoreModule(defModalData),
    );

  // 当前 store 模组的 `state`
  function getModalState(): ModalState {
    return store.state[storePath];
  }

  return {
    getModalState,
    isShow: () => getModalState().show,
    show(data: ModalOptions, reset: boolean = false): ModalData {
      const modalState = getModalState();
      console.log("---------------- modalState=", modalState);
      if (
        modalState.pageState === ModalPageState.HIDED ||
        modalState.pageState === ModalPageState.UNLOAD
      )
        return modalState.data;
      const resultData: ModalData = {
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
    onShowChange(callback: ShowCallback): () => void {
      return onChange(callback, showListeners, storePath);
    },
    onDataChange(callback: DataCallBack): () => void {
      return onChange(callback, dataListeners, storePath);
    },
  };
}
