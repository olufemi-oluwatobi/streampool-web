// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export * from "./http";

export type User = {
  id: number;
  name: string;
};

export interface ISVGPath {
  d: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: "inherit" | "butt" | "round" | "square";
  strokeLinejoin?: "inherit" | "round" | "miter" | "bevel";
}
[];

export type StreamPlan = {
  id: number;
  name: string;
  currency: string;
  max_limit: string;
  amount: string;
  stream_service_id: number;
  created_at: string;
  updated_at: string;
};

export type StreamService = {
  id: number;
  name: string;
  icon: string;
  entrance_type: "credentials" | "invites";
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
  planCount: number;
  poolCount: string;
  streamPlans: StreamPlan[];
};

export type TokenType = { type: string; token: string; expires_at: string };
export type Authorization = {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: "visa" | "mastercard";
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
};

export type EmailType = {
  email: "valentine@digiftng.com";
  id: number;
  is_active: boolean;
  is_in_use: boolean;
};
export type PoolCredentials = {
  email_id: string;
  id: number;
  account_email?: string;
  password: string;
  email: EmailType;
  pool_id: number;
  updated_at: string;
  created_at: string;
};
export type PoolType = {
  id: number;
  name: string;
  max_member_count: number;
  owner_id: string;
  stream_service_id: number;
  stream_plan_id: number;
  created_at: string;
  updated_at: string;
  plan_code: string;
  members?: UserType[];
  payment_date: string;
  is_disabled: boolean;
  is_at_max_capacity: boolean;
  members_count: string | null;
  streamService: StreamService;
  streamPlan: StreamPlan;
  poolCredential: PoolCredentials;
};
export type PoolRequestType = {
  status: string;
  id: number;
  user_id: string;
  user?: UserType;
  streamService: StreamService;
  pool?: PoolType;
  pool_id: number;
  created_at: string;
  updated_at: string;
  stream_service_id: number;
};
export type ServiceEmails = {
  created_at: string;
  email: string;
  id: number;
  stream_service_id: number;
  user_id: string;
};
export type UserType = {
  id: string;
  email: string;
  username: string;
  user_role: string;
  created_at: string;
  updated_at: string;
  poolRequests: PoolRequestType[];
  membershipRequests: PoolRequestType[];
  pools: PoolType[];
  emails: ServiceEmails[];
  offeredSubs: PoolType[];
  account_name: string;
  bank: string;
  account_number: string;
};
export type AuthDataType = {
  token: TokenType;
  user: UserType;
  paymentDetails?: Authorization[];
};
