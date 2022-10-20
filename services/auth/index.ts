import BaseApi from "../api/new-index";

class AuthService extends BaseApi {
    constructor() {
        super()
    }
    formUrl = (url: string) => `/auth/${url}`;

    async initializePayment() {
        return this.request.post(this.formUrl("payment/init"), {});
    }

    async getOnboardingStatus() {
        return this.request.get(this.formUrl("onboarding_status"));
    }
    async verifyUser(token: string) {
        return this.request.post(`/verify?token=${token}`);
    }

    async me() {
        return this.request.get(this.formUrl("me"));
    }

    async forgotPassword(data: { email: string }) {
        return this.request.post(this.formUrl("forgot_password"), data);
    }

    async resetPassword(data: {
        email: string;
        newPassword: string;
        token: string;
    }) {
        const { token } = data
        delete data.token
        return this.request.post(
            this.formUrl(`reset_password?token=${token}`),
            data
        );
    }

    async paymentInfo(email: string) {
        return this.request.get(`https://api.paystack.co/customer/${email}`, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
            },
        });
    }

    async deletePaymentMethod(authorizationId: string) {
        return this.request.post(
            `https://api.paystack.co/customer/deactivate_authorization`,
            { authorization_code: authorizationId },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
                },
            }
        );
    }

    async register(data: {
        email: string;
        password: string;
        userRole: string;
        username: string;
    }) {
        const baseUrl = window.location.origin;

        return this.request.post(this.formUrl("register"), {
            ...data,
            verificationUrl: baseUrl,
        });
    }

    async login(data: { email: string; password: string, accessToken?: string, authBasis?: "gmail" }) {
        return this.request.post(this.formUrl("login"), data);
    }
}

export default new AuthService();
