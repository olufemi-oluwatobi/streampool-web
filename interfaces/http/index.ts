/* eslint-disable */
import { StaticImageData } from 'next/image'

export type ApiResponse<T = Record<string, any>> = {
  status: number,
  data: T | null,
  message: string,
  errMessage: string | { message: string }
  error: string
}

export enum ProfileTypes {
  Personal = 'personal',
  Business = 'business',
  Both = 'both'
}

export interface Ref { ref: string, 'transaction_id': string, paymentRef: string }

export type ResetPasswordHeaders = {
  'access-token': string,
  client: string,
  'client_id': string,
  config: string,
  expiry: string,
  'reset_password': string,
  token: string,
  uid: string
}

// PAYLOADS
export type BusinessRegistrationPayload = {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  profile_type: string;
  business_name: string;
  industry: string;
  country: string;
  staff_strength: string;
  role: string;
  website: string;
  registration_status: string
}

export type PersonalRegistrationPayload = {
  email: string;
  password: string;
}

export type BVNPayload = {
  bvn: string,
  fileBaseUrl: string
}



export type LoginPayload = {
  email: string;
  password: string;
}

export type Category = {
  title: string;
  id: string;
}

export type ForgotPasswordPayload = {
  email: string;
}

export type ResetPasswordPayload = {
  password: string;
  password_confirmation: string
}

export type UserProfileSettingsPayload = {
  "email"?: string,
  "data"?: {
    "profile"?: {
      "first_name"?: string,
      "last_name"?: string,
      "phone_number"?: string,
      "image"?: string,
      'bvn'?: string
    },
  }
}

export type UserPasswordPayload = {
  password: string,
  password_confirmation: string
}

export type TEAM_MEMBER = {
  "role": string,
  "business_team": {
    "team_name": string
  },
  "profile": {
    "id": number,
    "first_name": string,
    "last_name": string,
    "phone_number": string,
    "profile_type": string,
    "image": any,
    "test_mode": boolean,
    "user": {
      "id": string,
      "uid": string,
      "provider": string,
      "email": string
    }
  }
}

// RESPONSES
export type UserProfile = {
  profile: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    phone_number: string;
    profile_type: ProfileTypes;
    test_mode: boolean;
    bvn: string
  },
  user: {
    id: number;
    email: string;
    provider: string;
    uid: string;
  },
  business: {
    id?: number | string;
    business_name?: string;
    profile_id?: number | string;
    industry?: string;
    country_of_incorporation?: string;
    staff_strength?: number | string;
    registration_status?: string;
    role_at_business?: string;
    website?: string;
    created_at?: string;
    updated_at?: string;
    api_key?: string;
    is_live?: boolean;
    team_members: TEAM_MEMBER[]
  },
  team: { id: string, team_name: string },
  wallet: {
    cleared_balance: number | string;
    available_balance: number | string;
    is_test: boolean
  }[],
  virtual_account?: {
    account_name: string
    account_number: string
    bank_name: string
  }
  isTempUser: {
    email: string,
    phone_number: string,
    exp: string | number
  } | null
}

export type INVITE_TEAMMEMBER_PAYLOAD = {
  "email": string,
  "role": string,
  "team_id": number
}

export type GIFT_CARD = {
  '__type': string,
  'caption': string,
  'currency': string,
  'code': string,
  'color': string,
  'desc': string,
  airtime_type?: string,
  cable_type?: string,
  cardType?: string,
  'disclosures': string,
  'fontcolor': string,
  'is_variable': boolean,
  'fee': string
  'iso': string,
  'logo': string | StaticImageData,
  'max_range': number,
  'min_range': number,
  'sendcolor': string,
  'value': number[] | string[] | 'inputable'
}

export type GIFT_CARDS = {
  giftCards: GIFT_CARD[]
  giftCard: GIFT_CARD
}

export type CABLE_OPTIONS = { title: string, value: string, is_active: boolean }

export type EPIN_PROVIDERS = { service_type: string, shortname: string, biller_id: number, product_id: number, name: string }
export type ORDER = {
  "id": string,
  "card_order_id": string,
  "amount": number,
  "total_amount": number,
  "quantity": number,
  "gift_card_code": string,
  "order_type": string,
  "status": string,
  "created_at": string,
  "updated_at": string
}

export type TRANSACTION = {
  "id": string,
  "profile_id": number,
  "log_type": string,
  "status": string,
  "reference_id": string,
  "amount": number,
  'gift_card_code': string,
  'gift_card_name': string,
  "transaction_rate": number,
  "created_at": string,
  "updated_at": string,
  orders: ORDER[]
}

export type TRANSACTIONS = {
  transactions: TRANSACTION[],
  transaction: TRANSACTION
}


export type CartPayload = {
  value: number;
  quantity: number;
  card_code: string;
};

export type CartItemUpdatePayload = {
  quantity: number;
};


export type CartItem = {
  id: number
  cart_id: number | string
  value: number
  quantity: number
  card_code: number | string
}

export type CartReducer = {
  data: {
    id: string,
    cartItems: CartItem[]
  }
}


export type CartTransactionPayload = {
  "amount": number,
  "card_code": string,
  "cart_id": string
}

export type CartPaymentPayload = {
  "action": string,
  "from": string,
  "sender": string,
  "postal": string,
  "address": string,
  "msg": string,
  "reference": string,
  "cart": string
}