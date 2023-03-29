const pool = require('../data/config');
const accountsCtrl = {}


accountsCtrl.getAccounts = (request, response) => {
    pool.query('SELECT * FROM accounts ORDER BY priority', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
accountsCtrl.getAccounts2 = (request, response) => {
    id=request.params.id;
    pool.query('SELECT * FROM accounts where cliente=?  ORDER BY priority', id,(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
accountsCtrl.addAccount = (request, response) => {
    let query = 'INSERT INTO accounts SET ?'
    pool.query(query, request.body,(error, result) => {
        if (error) throw error;
        response.send({message: 'Account Created.'})
    });
}

accountsCtrl.editAccount = (request, response) => {
    const id = request.params.id_account;
    let query = 'UPDATE accounts SET ? WHERE id_account = ?'
    pool.query(query, [request.body, id],(error, result) => {
        if (error) throw error;
        response.send({message: 'Account updated successfully.'})
    });
}

accountsCtrl.deleteAccount = (request, response) => {
    const id = request.params.id_account;
    let query = 'UPDATE accounts SET Estado = 0 where id_account=? '
    pool.query(query, id,(error, result) => {
        if (error) throw error;
        response.send({message: 'Account deleted.'})
    });    

}

accountsCtrl.activateAccount = (request, response) => {
    const id = request.params.id_account;
    let query = 'UPDATE accounts SET Estado = 1 where id_account=? '
    pool.query(query, id,(error, result) => {
        if (error) throw error;
        response.send({message: 'Account Activated.'})
    });    

}

module.exports = accountsCtrl