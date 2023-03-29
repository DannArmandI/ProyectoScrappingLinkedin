const pool = require('../data/config');
const descargas = {}


descargas.getDownloads = (request, response) => {
    id=request.params.id;
    pool.query('SELECT * FROM descarga where id_Company=?',id,(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

descargas.getDownloadsDone = (request, response)=>{
    
    id=request.params.id;
    pool.query('SELECT descarga.* FROM descarga JOIN posts ON descarga.id_descarga=posts.id_descarga WHERE descarga.id_Company=? GROUP BY descarga.id_descarga',id,(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

descargas.AgregarDownload = (request, response) => {
    console.log(request.body)
    pool.query('INSERT INTO descarga(Fecha_Des,Fecha_Has,Estado,Fecha_Cre,id_Company) values (?,?,?,NOW(),?)',[request.body.Fecha_Des,request.body.Fecha_Has,request.body.Estado,request.body.id_Company],(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}
descargas.DeleteDownload = (request, response) => {
    let query = 'UPDATE descarga SET Estado=0 WHERE id_descarga=?;'
    pool.query(query, request.params.id,(error, result) => {
        if (error) throw error;
        response.send({message: 'Account Created.'})
    });
}

descargas.ActivateDownload = (request, response) => {
    let query = 'UPDATE descarga SET Estado=1 WHERE id_descarga=?;'
    pool.query(query, request.params.id,(error, result) => {
        if (error) throw error;
        response.send({message: 'Account Activated.'})
    });
}

descargas.editDownload = (request, response) => {
    const id = request.params.id;
    let query = 'UPDATE descarga SET Fecha_Des=? , Fecha_Has=?, Estado=? , Fecha_Act=NOW() WHERE id_descarga = ?'
    pool.query(query, [request.body.Fecha_Des,request.body.Fecha_Has,request.body.Estado,id],(error, result) => {
        if (error) throw error;
        response.send({message:result})
    });
}

module.exports = descargas