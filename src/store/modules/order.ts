import CartModuleState from '@/interfaces/states/cart-module';
import OrderProduct from '@/interfaces/order-product';

const state: CartModuleState = {
  products: []
};

const getters = {
  getProducts: (state: CartModuleState) => state.products,
  getTotalPrice: (state: CartModuleState) =>
    state.products.reduce(
      (total: number, product) => (total += product.cost * product.quantity),
      0
    )
};

const mutations = {
  ADD_PRODUCT(state: CartModuleState, product: OrderProduct) {
    const exisitingProduct = state.products.find(
      (p) => p.name === product.name
    );

    exisitingProduct
      ? state.products[state.products.indexOf(exisitingProduct)].quantity++
      : state.products.push(product);
  },
  REMOVE_PRODUCT(state: CartModuleState, product: OrderProduct) {
    const exisitingProduct = state.products.find(
      (p) => p.name === product.name
    );

    if (exisitingProduct) {
      const productIndex = state.products.indexOf(exisitingProduct);
      state.products.splice(productIndex, 1);
    }
  },
  CLEAR_PRODUCTS(state: CartModuleState) {
    state.products = [];
  }
};

export default {
  state,
  getters,
  mutations
};
