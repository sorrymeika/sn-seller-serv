const { Dao } = require('sonorpc');

class SellerDao extends Dao {
    async getSellersByAccountId(accountId) {
        return this.connection.query(
            `select a.id,name,type,logo,mobilePhone,a.accountId as adminId,a.addDt,paymentTypes,description,status,
                    b.accountId 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0`,
            [accountId]
        );
    }

    async isMySeller(accountId, sellerId) {
        const rows = await this.connection.query(
            `select a.id 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0 and sellerId=@p1 limit 1`,
            [accountId, sellerId]
        );
        return rows.length > 0;
    }

    async getMySellerIds(accountId) {
        const rows = await this.connection.query(
            `select a.id 
                from seller a
                inner join sellerAccountRel b on a.id=b.sellerId
            where b.accountId=@p0 and a.status!=0`,
            [accountId]
        );
        return rows.map((row) => row.id);
    }

    getPlatformSellers({ status }) {
        const args = [];
        let where = "type=4";
        let i = 0;
        if (status != null) {
            where += ' and status=@p' + i++;
            args.push(status);
        }
        return this.connection.query('select id,name,type,logo,mobilePhone,accountId,addDt,paymentTypes,description,status from seller where ' + where, args);
    }

    getSellersByIds(sellerIds) {
        return this.connection.query(`select id,name,type,logo,status from seller where status!=0 and id in (${sellerIds.join(',')})`);
    }

    async getSellerById(sellerId) {
        const rows = await this.connection.query('select id,name,type,logo,descScore,servScore,postScore,accountId,addDt,description from seller where status=1 and id=@p0', [sellerId]);
        return rows[0];
    }

    addSeller({
        name,
        type,
        mobilePhone,
        logo,
        accountId,
        addDt,
        paymentTypes,
        description
    }) {
        return this.app.transaction(async (conn) => {
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
    }
}

module.exports = SellerDao;