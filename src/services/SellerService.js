const { Service } = require('sonorpc');

const PAGE_STATUS_ERROR = { success: false, code: 11000, message: '页面状态错误!' };

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