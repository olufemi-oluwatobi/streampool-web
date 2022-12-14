import BaseApi from "../api/new-index";
import { UserType } from "@interfaces/index";
import { AxiosResponse } from "axios";

type AccountVerificationResponse = {
  status: true;
  message: "Account number resolved";
  data: {
    account_number: "0001234567";
    account_name: "Doe Jane Loren";
    bank_id: 9;
  };
};
class AuthService extends BaseApi {
  constructor() {
    super();
    this.loadRequest();
  }
  formUrl = (url: string) => `/auth/${url}`;

  async initializePayment() {
    this.loadRequest();
    return this.request.post(this.formUrl("payment/init"), {});
  }

  async getOnboardingStatus() {
    this.loadRequest();
    return this.request.get(this.formUrl("onboarding_status"));
  }
  async verifyUser(token: string) {
    this.loadRequest();
    return this.request.post(`/verify?token=${token}`);
  }

  async me() {
    this.loadRequest();
    return this.request.get(this.formUrl("me"));
  }

  async update(data: Partial<UserType>) {
    this.loadRequest();
    return this.request.post(this.formUrl("update"), data);
  }

  async forgotPassword(data: { email: string }) {
    this.loadRequest();
    return this.request.post(this.formUrl("forgot_password"), data);
  }

  async resetPassword(data: {
    email: string;
    newPassword: string;
    token: string;
  }) {
    const { token } = data;
    delete data.token;
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

  async verifyAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<AxiosResponse<AccountVerificationResponse>> {
    return this.request.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        },
      }
    );
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

  async signup(data: {
    email: string;
    password: string;
    userRole: string;
    username: string;
  }) {
    const baseUrl = window.location.origin;
    return this.request.post(this.formUrl("signup"), {
      ...data,
      verificationUrl: baseUrl,
    });
  }

  async login(data: {
    email: string;
    password: string;
    accessToken?: string;
    authBasis?: "google";
  }) {
    return this.request.post(this.formUrl("login"), data);
  }
}

export default new AuthService();
