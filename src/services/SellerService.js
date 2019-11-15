const { Service } = require('sonorpc');
const { PARAM_ERROR } = require('../constants/error');

class SellerService extends Service {
    async getSellersByAccountId(accountId) {
        const rows = await this.ctx.mysql.query(
            `select a.id,name,type,logo,mobilePhone,a.accountId as adminId,a.addDt,paymentTypes,description,status,
                    b.accountId 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0`,
            [accountId]
        );
        return { success: true, code: 0, data: rows };
    }

    async isMySeller(accountId, sellerId) {
        const rows = await this.ctx.mysql.query(
            `select a.id 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0 and sellerId=@p1 limit 1`,
            [accountId, sellerId]
        );
        return { success: true, value: rows.length > 0 };
    }

    async listMySellerIds(accountId) {
        const rows = await this.ctx.mysql.query(
            `select a.id 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0`,
            [accountId]
        );
        return { success: true, data: rows.map((row) => row.id) };
    }

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
        const res = await this.ctx.mysql.useTransaction(async (conn) => {
            const sellerRes = await conn.insert('seller', {
                name,
                type,
                mobilePhone,
                logo,
                accountId,
                addDt,
                paymentTypes,
                description
            });

            await conn.insert('sellerAccountRel', {
                accountId,
                sellerId: sellerRes.insertId,
                role: 1,
                createAt: new Date()
            });

            return sellerRes;
        });
        return { success: !!res.insertId, id: res.insertId };
    }
}

module.exports = SellerService;