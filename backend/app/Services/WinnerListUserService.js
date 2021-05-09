'use strict'

const ErrorFactory = use('App/Common/ErrorFactory');
const WinnerListModel = use('App/Models/WinnerListUser');

class WinnerListUserService {
  buildQueryBuilder(params) {
    let builder = WinnerListModel.query();
    if (params.id) {
      builder = builder.where('id', params.id);
    }
    if (params.email) {
      builder = builder.where('email', params.email);
    }
    if (params.wallet_address) {
      builder = builder.where('wallet_address', params.wallet_address);
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }

    // For search box
    if (params.search_term) {
      builder = builder.where(query => {
        query.where('wallet_address', 'like', '%'+ params.search_term +'%')
          .orWhere('email', 'like', '%'+ params.search_term +'%');
      })
    }

    return builder;
  }

  buildSearchQuery(params) {
    let builder = WinnerListModel.query();
    if (params.search) {
      builder = builder.where('email', 'like', '%' + params.search + '%')
        .orWhere('wallet_address', 'like', '%' + params.search + '%');
    }
    if (params.campaign_id) {
      builder = builder.where('campaign_id', params.campaign_id);
    }
    return builder;
  }

  async findWinnerListUser(params) {
    let builder = this.buildQueryBuilder(params);
    if (params.page && params.pageSize) {
      // pagination
      return await builder.paginate(params.page, params.pageSize);
    }
    // return all result
    return await builder.fetch();
  }

  async findOneByFilters(params) {
    return await this.buildQueryBuilder(params).first();
  }

  async search(params) {
    let builder = this.buildSearchQuery(params);
    if (params.page && params.pageSize) {
      // pagination
      return await builder.paginate(params.page, params.pageSize);
    }
    // return all result
    return await builder.fetch();
  }

  async save(winnerList) {
    const data = winnerList.rows.map(item => {
      let model = new WinnerListModel;
      model.email = item.email;
      model.wallet_address = item.wallet_address;
      model.campaign_id = item.campaign_id;
      return model;
    });
    console.log(data);
    await WinnerListModel.createMany(data);
  }


  async saveRandomWinner(winnerList) {
    const data = winnerList.rows.map(async item => {

      const isExist = await WinnerListModel.query()
        .where('wallet_address', item.wallet_address)
        .where('campaign_id', item.campaign_id)
        .first();

      if (isExist) return null;

      let model = new WinnerListModel;
      model.email = item.email;
      model.wallet_address = item.wallet_address;
      model.campaign_id = item.campaign_id;
      model.save();

      return model;
    });
  }


  async addWinnerListUser(params) {
    console.log('[addWinnerListUser] - Params: ', params);
    const winnerlist = new WinnerListModel;
    winnerlist.wallet_address = params.wallet_address;
    winnerlist.campaign_id = params.campaign_id;
    winnerlist.email = params.email;
    await winnerlist.save();

    console.log('Res: ', winnerlist);
    return winnerlist;
  }
}

module.exports = WinnerListUserService;
