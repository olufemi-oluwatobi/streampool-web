import { AnyAction } from 'redux';
import { FLAGGED_CARDS } from '../../constants'
import actions from '../action-types/giftcards';
import cableAction from '../action-types/cable';


const GLO_AIRTIME = 'https://res.cloudinary.com/digift/image/upload/v1649244942/utilities/glo_z9tmdz.png'
const DSTV_IMAGE = 'https://res.cloudinary.com/digift/image/upload/v1649245033/utilities/dstv_sana5w.svg'
const GO_TV_IMAGE = 'https://res.cloudinary.com/digift/image/upload/v1649245034/utilities/gotv_mhunxp.svg'
const WAEC_IMAGE = 'https://res.cloudinary.com/digift/image/upload/v1649244935/utilities/waec_lypdyp.png'

const AIRTEL_AIRTIME = 'https://res.cloudinary.com/digift/image/upload/v1649244935/utilities/airtel_v6wazk.png'
const MTN_AIRTIME = 'https://res.cloudinary.com/digift/image/upload/v1649244935/utilities/mtn_airtime_uw3flt.png'
const NINE_MOBILE_AIRTIME = 'https://res.cloudinary.com/digift/image/upload/v1649244935/utilities/nine_mobile_jwhcuw.png'
const IKEJA_ELECTRIC = 'https://res.cloudinary.com/digift/image/upload/v1649245034/utilities/ie_skaed8.png'
const EKEDC = 'https://res.cloudinary.com/digift/image/upload/v1649245037/utilities/ekedc_qpegxa.png'
const IBEADC = 'https://res.cloudinary.com/digift/image/upload/v1649245034/utilities/ibedc_hn5ucf.png'

import { GIFT_CARD, GIFT_CARDS, EPIN_PROVIDERS, CABLE_OPTIONS, Category } from '../../interfaces';



const initialState = {
    data: {
        giftCard: {} as GIFT_CARD,
        giftCards: []
    } as GIFT_CARDS,
    cableOptions: [] as CABLE_OPTIONS[],
    cableList: [],
    cable: {} as GIFT_CARD,
    paymentRef: null,
    epinProviders: [] as EPIN_PROVIDERS[],
    isAuthenticated: false,
    isLoading: false,
    categories: [] as Category[]
};

const airtimePayload: GIFT_CARD[] = [{
    __type: 'item',
    caption: 'Glo Airtime',
    code: 'airtime',
    color: '#430A78',
    airtime_type: 'glo',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: GLO_AIRTIME,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'MTN Airtime',
    code: 'airtime',
    airtime_type: 'mtn',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: MTN_AIRTIME,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'WAEC',
    code: 'epin',
    // TODO: CHANGE TO UTILITY TYPE
    airtime_type: 'waec',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: 'utilities',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: WAEC_IMAGE,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'Airtel Airtime',
    code: 'airtime',
    airtime_type: 'airtel',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: AIRTEL_AIRTIME,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: '9 Mobile Airtime',
    code: 'airtime',
    airtime_type: '9mobile',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: NINE_MOBILE_AIRTIME,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'DSTV Subscription',
    code: 'cable',
    cable_type: 'dstv',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: DSTV_IMAGE,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'GOTV Subscription',
    code: 'cable',
    cable_type: 'gotv',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: '',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: GO_TV_IMAGE,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
}, {
    __type: 'item',
    caption: 'Ikeja Electric',
    code: 'cable',
    cable_type: 'ikeja_electric',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: 'utilities',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: IKEJA_ELECTRIC,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},

{
    __type: 'item',
    caption: 'EKO Electric',
    code: 'cable',
    cable_type: 'eko_electric',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: 'utilities',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: EKEDC,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},
{
    __type: 'item',
    caption: 'Ibadan Electric',
    code: 'cable',
    cable_type: 'ibadan_electric',
    color: '#430A78',
    currency: 'NGN',
    desc: 'Purchase your ',
    disclosures: 'utilities',
    fee: '0',
    fontcolor: '#FFFFFF',
    is_variable: true,
    iso: 'us',
    logo: IBEADC,
    max_range: 200,
    min_range: 25,
    sendcolor: '#FFFFFF',
    value: 'inputable'
},

]




type GiftCardReducerTypes = typeof initialState;


const getStagedGiftCard = (id: number | string, state: GiftCardReducerTypes) => {
    const { giftCards } = state.data;
    const giftCard = giftCards.filter(card => card.code === id || card.airtime_type === id || card.cable_type === id)[0]
    return giftCard
}



const formatGiftCardsPayload = (giftCards: GIFT_CARD[]): GIFT_CARD[] => {
    const isInproduction = process.env.NODE_ENV === 'production'
    return giftCards.map(giftCard => {
        const { value } = giftCard
        const valueArray = (value as unknown as string).split(',')
        return { ...giftCard, value: valueArray }
    }).filter(card => {
        if (isInproduction && FLAGGED_CARDS.includes(card.code)) {
            return false
        }

        // if (card.code.includes('sgc')) return false
        return card
    })
}

const removeGiftCardDuplicates = (data: GIFT_CARD[]) => {
    const uniqueArray = data.filter((value, index) => {
        const val = JSON.stringify(value);
        return index === data.findIndex(obj => {
            return JSON.stringify(obj) === val;
        });
    });
    return uniqueArray
}

const handleLocalSearches = (query: { [key: string]: string }, state = initialState): GIFT_CARD[] | [] => {
    try {
        const hasQuery = Object.values(query)?.filter(val => val)?.length;

        if (!hasQuery) return [] as GIFT_CARD[]

        const data: GIFT_CARD[] = []

        if (query.q) {
            data.push(...airtimePayload.filter(obj => obj.caption.toLowerCase().includes(query.q.toLowerCase())))
        }
        if (query.category) {
            const categories = query.category

            const selectedCategories = state.categories.filter(cat => categories.includes(cat.id))
            const tvType = ['dstv', 'gotv']

            const filteredData = Object.assign([], ...selectedCategories.map(cat => {

                const type = {
                    'utilities': airtimePayload.filter(airtime => !airtime.cable_type || !tvType.includes(airtime.cable_type)),
                    'television': airtimePayload.filter(airtime => tvType.includes(airtime.cable_type || '')),
                    'popular': airtimePayload,
                    'airtime & Electricity': airtimePayload.filter(airtime => !airtime.cable_type || !tvType.includes(airtime.cable_type))
                }

                const { title } = cat

                return type[(title.toLowerCase() as 'airtime & Electricity' | 'television' | 'popular', 'utilities')] || ([] as GIFT_CARDS[])
            }))
            data.push(...filteredData)
        }
        return data
    } catch (error) {

        return [] as GIFT_CARD[]
    }

}


export default (state = initialState, { type, payload }: AnyAction): GiftCardReducerTypes => {
    switch (type) {
        case actions.GET_AVAILABLE_GIFT_CARDS:
            return {
                ...state,
                data: { ...state.data, giftCards: [...removeGiftCardDuplicates([...state.data.giftCards, ...formatGiftCardsPayload(payload), ...airtimePayload])] },
            };
        case actions.SEARCH_GIFT_CARD:
            return {
                ...state,
                data: {
                    ...state.data,
                    giftCards: removeGiftCardDuplicates([...handleLocalSearches(payload.query, state), ...formatGiftCardsPayload(payload.data),])
                },
            };
        case actions.LOADING_GIFT_CARD:
            return {
                ...state,
                isLoading: payload
            };
        case cableAction.GET_CABLE_OPTIONS:
            return {
                ...state,
                cableOptions: payload
            };
        case actions.STAGE_GIFT_CARD:

            return {
                ...state,
                data: { ...state.data, giftCard: getStagedGiftCard(payload, state) },
            };
        case cableAction.STAGE_CABLE:

            return {
                ...state,
                data: { ...state.data },
                cable: getStagedGiftCard(payload, state)
            };
        case cableAction.GET_CABLE_PRODUCT_LIST:

            return {
                ...state,
                cableList: payload
            };
        case cableAction.GET_EPIN_PROVIDERS:
            return {
                ...state,
                epinProviders: payload
            };

        case cableAction.UNSTAGE_CABLE:

            return {
                ...state,
                data: { ...state.data },
                cable: {} as GIFT_CARD
            };
        case actions.UNSTAGE_GIFT_CARD:

            return {
                ...state,
                data: { ...state.data, giftCard: {} as GIFT_CARD },
            };
        case actions.GET_CATEGORIES:

            return {
                ...state,
                categories: payload
            };
        case actions.INITIATE_TRANSACTION_FLOW:
            return {
                ...state,
                paymentRef: payload
            };
        default:
            return state;
    }
};
