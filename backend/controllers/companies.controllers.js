const pool = require('../data/config');
const companiesCtrl = {}


companiesCtrl.getCompanies = (request, response) => {
    pool.query('SELECT * FROM companies', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
companiesCtrl.getCompanies2 = (request, response) => {
    const id = request.params.id;
    const cliente = request.params.cliente;
    pool.query('SELECT * FROM companies where cliente=?',[cliente], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
companiesCtrl.getCompanies2Download = (request, response) => { //muestra las compañias vinculadas a un cliente unicamente si tienen descargas
    
    const id = request.params.id;
    const cliente = request.params.cliente;
    pool.query('SELECT companies.* FROM companies JOIN posts ON posts.idCompany=companies.id_company WHERE companies.cliente=? GROUP BY companies.id_company',[cliente], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
companiesCtrl.getCompanies2DownloadSA = (request, response) => { //muestra todas las compañias que tienen descargas
    console.log("hola mundo");
    pool.query('SELECT companies.* FROM companies JOIN posts ON posts.idCompany=companies.id_company GROUP BY companies.id_company', (error, result) => {
        if (error) throw error;

        console.log("hola")
        console.log(result);
        response.send(result);
    });
}



companiesCtrl.AgregarCompanies = (request, response) => {
    pool.query('INSERT INTO companies(name_company,url_Company,date,Estado,cliente) values (?,?,NOW(),?,?)', [request.body.name_company,request.body.url_Company,request.body.Estado,request.body.cliente], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
companiesCtrl.ActualizarCompanies = (request, response) => {
    const id = request.params.id;
    pool.query('UPDATE companies SET name_company=? , url_Company=? WHERE id_company = ?', [request.body.name_company,request.body.url_Company,id], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
companiesCtrl.EliminarCompanies = (request, response) => {
    const id = request.params.id;
    pool.query('UPDATE companies SET Estado=0 WHERE id_company = ?', [id], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}


companiesCtrl.ActivarCompanies = (request, response) => {
    const id = request.params.id;
    pool.query('UPDATE companies SET Estado=1 WHERE id_company = ?', [id], (error, result) => {
        if (error) throw error;
        response.send({message: "company activated"});
    });
}

companiesCtrl.getCompaniesBetweenDates = (request, response) => {
    
    let from = new Date(request.body.from)
    let to = new Date(request.body.to)

    let query = 'SELECT * FROM companies WHERE (date BETWEEN ? AND ?)'

    pool.query(query,[from, to], (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}


module.exports = companiesCtrl