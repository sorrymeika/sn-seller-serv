const { Service } = require('sonorpc');
const { PARAM_ERROR } = require('../constants/error');

class SellerService extends Service {
    async listPlatformSellers({ status }) {
        const args = [];
        let where = "type=4";
        let i = 0;

        if (status != null) {
            where += ' and status=@p' + i++;
            args.push(status);
        }

        const rows = await this.ctx.mysql.query('select id,name,type,logo,mobilePhone,accountId,addDt,paymentTypes,description,status from seller where ' + where, args);
        return { success: true, code: 0, data: rows };
    }

    async listSellerByIds(sellerIds) {
        if (sellerIds.some(id => !/^\d+$/.test(id))) {
            return PARAM_ERROR;
        }

        const rows = await this.ctx.mysql.query(`select id,name,type,logo,status from seller where status!=0 and id in (${sellerIds.join(',')})`);
        return { success: true, code: 0, data: rows };
    }

    async getSellerInfoById(sellerId) {
        const rows = await this.ctx.mysql.query('select id,name,type,logo,descScore,servScore,postScore,accountId,addDt,description from seller where status=1 and id=@p0', [sellerId]);
        return { success: true, code: 0, data: rows && rows[0] };
    }

    async addSeller({
        name,
        type,
        mobilePhone,
        logo,
        accountId,
        addDt,
        paymentTypes,
        description
    }) {
        const res = await this.ctx.mysql.insert('seller', {
            name,
            type,
            mobilePhone,
            logo,
            accountId,
            addDt,
            paymentTypes,
            description
        });
        return { success: !!res.insertId, id: res.insertId };
    }
}

module.exports = SellerService;