const pool = require('../data/config');
const sentimientosCtrl = {}

//OBTIENE TODAS LAS ID DE DESCARGAS CON SUS RESPECTIVOS RANGOS DE FECHAS
sentimientosCtrl.obtenerDatosDescargas = (request, response) => {
    let query = 'SELECT * FROM descarga WHERE id_Company =?'
    pool.query(query, request.params.idCompany, (error, result) => {
        if (error) {
            console.log("error primer metodo");
            throw error;
        }
        response.send(result);
    });
}

//OBTIENE TODOS LOS POST SEGÚN EL ID DE LA DESCARGA
sentimientosCtrl.obtenerIdPost = (request, response) => {
    let query = 'SELECT id_post FROM posts WHERE id_descarga=? AND published_date BETWEEN  ? AND  ?'
    console.log("datos backkkkk: " + JSON.stringify(request.body))
    pool.query(query, [request.body.idDescarga, request.body.fechaDesde, request.body.fechaHasta],(error, result) => {
        if (error) {
            console.log()
            throw error;
        }
        response.send(result);
    });
}

//OBTIENE TODOS LOS SENTIMIENTOS DE TODOS LOS POST DE UNA DESCARGA
sentimientosCtrl.obtenerSentimientos = (request, response) => {
    const idPost = request.params.idPost
    console.log("idPost:" + idPost)

    const querySentiminetos = `SELECT sentiment FROM comments WHERE idPost =?`

    pool.query(querySentiminetos, request.params.idPost, (error, result) => {
        if (error) {
            console.log("error segundo metodo");
            throw error;
        }
        response.send(result);
    })
}   

module.exports = sentimientosCtrl