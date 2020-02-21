const { Service } = require('sonorpc');
const { PARAM_ERROR } = require('../constants/error');

class SellerService extends Service {
    async getSellersByAccountId(accountId) {
        const rows = await this.app.dao.seller.getSellersByAccountId(accountId);
        return { success: true, code: 0, data: rows };
    }

    async isMySeller(accountId, sellerId) {
        const value = await this.app.dao.seller.isMySeller(accountId, sellerId);
        return { success: true, value };
    }

    async getMySellerIds(accountId) {
        const rows = await this.app.dao.seller.getMySellerIds(accountId);
        return { success: true, data: rows };
    }

    async getPlatformSellers(params) {
        const rows = await this.app.dao.seller.getPlatformSellers(params);
        return { success: true, code: 0, data: rows };
    }

    async getSellersByIds(sellerIds) {
        if (sellerIds.some(id => !/^\d+$/.test(id))) {
            return PARAM_ERROR;
        }
        const rows = await this.app.dao.seller.getSellersByIds(sellerIds);
        return { success: true, code: 0, data: rows };
    }

    async getSellerById(sellerId) {
        const data = await this.app.dao.seller.getSellerById(sellerId);
        return { success: true, code: 0, data };
    }

    async addSeller(seller) {
        const res = await this.app.dao.seller.addSeller(seller);
        return { success: !!res.insertId, id: res.insertId };
    }
}

module.exports = SellerService;