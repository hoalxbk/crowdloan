import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer, Transform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createFilter } from 'redux-persist-transform-filter';
import thunk from 'redux-thunk';

import rootReducer, { RootState } from './reducers';

const initialState = {
  user: {
    data: '',
    loading: false,
    error: '',
  },
};

const middlewares = [thunk];

const userStateFilter = createFilter('user', ['data']);
const investorStateFilter = createFilter('investor', ['data']);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['campaigns', 'campaignCreate',  'campaignDetail', 'alert', 'campaignICORegister', 'transactionCampaign', 'transactionCampaign', 'affiliateCampaign', 'campaignAffiliateCreate', 'affiliateLinkGenerate', 'campaignErc20RateSet', 'campaignLatest', 'tokensByUser', 'tokenCreateByUser', 'campaignEdit', 'campaignStatusToggle', 'campaignRefundTokens', 'settingDeactivate', 'campaignProcessing'],
  whitelist: ['user', 'userConnect', 'investor'],
  transforms: [userStateFilter, investorStateFilter]
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

let store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));
let persistor = persistStore(store);

export default () => {
  return { store, persistor }
}
