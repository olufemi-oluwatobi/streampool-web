import { AnyAction } from 'redux';

import actions from '../../store/action-types/transactions';
import { TRANSACTION, TRANSACTIONS } from '../../interfaces/http';

const initialState = {
  data: {
    transactions: [],
    transaction: {} as TRANSACTION
  } as TRANSACTIONS
};

type TransactionReducerType = typeof initialState;

// const trx = new Array(20).fill(0).map(() => ({
//     'id': 'a533fd26-96a9-4e49-805c-802f203e1610',
//     'profile_id': 482313267,
//     'log_type': 'send',
//     'status': 'success',
//     'reference_id': '2d931510-d99f-494a-8c67-87feb05e1594',
//     'amount': 100,
//     'transaction_rate': 100,
//     'created_at': '2021-09-06T20:00:53.666Z',
//     'updated_at': '2021-09-06T20:00:55.895Z',
//     'orders': [
//       {
//         'id': 'd457c882-99db-4624-b189-8a457fa80b59',
//         'card_order_id': '2d931510-d99f-494a-8c67-87feb05e1594',
//         'amount': 100,
//         'total_amount': 100,
//         'quantity': 1,
//         'gift_card_code': '62',
//         'order_type': 'send',
//         'status': 'success',
//         'created_at': '2021-09-06T20:00:55.970Z',
//         'updated_at': '2021-09-06T20:00:55.970Z'
//       }
//     ] as ORDER[]
//   }))

export default (state = initialState, { type, payload }: AnyAction): TransactionReducerType => {
  switch (type) {
    case actions.GET_TRANSACTIONS:
      return {
        ...state,
        data: { ...state.data, transactions: payload },
      };

    default:
      return state;
  }
};
