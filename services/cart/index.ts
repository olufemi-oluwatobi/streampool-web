import HTTP from "../api";
import { CartPayload, CartItemUpdatePayload, CartPaymentPayload, CartTransactionPayload } from '../../interfaces/http'
import BaseService from "../base-service";



class CartService extends BaseService {
    protected getUrl = (url: string) => `/api/v1/${url}`;

    async getCart() {
        return HTTP.baseApi().get(this.getUrl("cart"));
    }

    async postCart(id: string, data: CartPayload) {
        return HTTP.baseApi().post(this.getUrl(`cart/${id}/item`), { data });
    }

    async generateCartReference(data: CartTransactionPayload) {
        return HTTP.baseApi().post(this.getUrl(`generate-transaction-reference/wallet/cart`), data);
    }

    async sendTransaction(data: CartPaymentPayload) {
        return HTTP.baseApi().post(this.getUrl(`gift-cards/send_retail/cart`), { data });
    }

    async updateCartItem(
        id: string,
        cartItemId: string,
        data: CartItemUpdatePayload
    ) {
        return HTTP.baseApi().put(
            this.getUrl(`cart/${id}/item/${cartItemId}`),
            { data }
        );
    }



    async deleteCartItem(cartId: string, cartItemId: string | number) {
        return HTTP.baseApi().delete(this.getUrl(`cart/${cartId}/item/${cartItemId}`));
    }
}

export default new CartService();
