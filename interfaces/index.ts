// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export * from './http'
export * from './react-redux'
export * from './store'

export type User = {
  id: number
  name: string
}

export interface ISVGPath {
  d: string,
  stroke: string,
  strokeWidth: number,
  strokeLinecap?: "inherit" | "butt" | "round" | "square",
  strokeLinejoin?: "inherit" | "round" | "miter" | "bevel"
}[]


export type StreamPlan = {
  "id": number,
  "name": string,
  "currency": string,
  "max_limit": string,
  "amount": string,
  "stream_service_id": number,
  "created_at": string,
  "updated_at": string
}

export type StreamService = {
  "id": number,
  "name": string,
  "icon": string,
  "entrance_type": "credentials" | "invites",
  "created_at": string,
  "updated_at": string,
  "is_disabled": boolean,
  "planCount": number,
  "poolCount": string
  "streamPlans": StreamPlan[]
}


export type TokenType = { "type": string, "token": string, "expires_at": string }
export type Authorization = { "authorization_code": string, "bin": string, "last4": string, "exp_month": string, "exp_year": string, "channel": string, "card_type": "visa" | "mastercard", "bank": string, "country_code": string, "brand": string, "reusable": boolean, "signature": string, "account_name": string | null }


export type PoolType = { "id": number, "name": string, "max_member_count": number, "owner_id": string, "stream_service_id": number, "stream_plan_id": number, "created_at": string, "updated_at": string, "plan_code": string, "payment_date": string, "is_disabled": boolean, "is_at_max_capacity": boolean, "members_count": string | null }
export type PoolRequestType = { "status": string, "id": number, "user_id": string, "pool_id": number, "created_at": string, "updated_at": string, "stream_service_id": number }
export type ServiceEmails = { created_at: string, email: string, id: number, stream_service_id: number, user_id: string }
export type UserType = { "id": string, "email": string, "username": string, "user_role": string, "created_at": string, "updated_at": string, "poolRequests": PoolRequestType[], "pools": PoolType[], emails: ServiceEmails[] }
export type AuthDataType = { "token": TokenType, "user": UserType, paymentDetails?: Authorization[] }
