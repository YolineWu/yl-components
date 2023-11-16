import Modal from "./Modal.vue";
import { useModalMixin } from "./useModalMixin";
import {
  DEFAULT_MODAL_STORE_PATH,
  DEFAULT_MODAL_OPTIONS,
  ModalEvent,
  useModal,
} from "./useModal";

export {
  DEFAULT_MODAL_STORE_PATH,
  DEFAULT_MODAL_OPTIONS,
  ModalEvent as YLModalEvent,
  useModal as useYLModal,
  useModalMixin as useYLModalMixin,
  Modal as YlModal,
};
