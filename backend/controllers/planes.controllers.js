const pool = require('../data/config');
const planesCtrl = {}


planesCtrl.mostrarPlanes = (request,response) => {
    pool.query('SELECT * FROM planes', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

planesCtrl.mostrarPlan = (request,response) => {
    const id_plan = request.params.id_plan;
    let query = 'SELECT * FROM planes WHERE id_plan = ?';
    pool.query(query, id_plan, (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

planesCtrl.agregarPlan = (request, response) => {
    let flagExiste = 'SELECT * FROM planes WHERE nombre_plan = ?';
    pool.query(flagExiste, request.body.nombre_plan, (error, result) => {
        if (result.length != 0){
            response.send({message: 'El plan ya existe.'})
        }
        else{
            let query = 'INSERT INTO planes SET created_at = now(), updated_at = now(), estado = 1, ?'
            pool.query(query, request.body,(error, result) => {
                if (error) throw error;
                response.send({message: 'Plan creado con exito.'});
            });
        }
    });
}

planesCtrl.editarPlan = (request, response) => {
    const id_plan = request.params.id_plan;
    flagNombre_plan = 'SELECT nombre_plan FROM planes WHERE nombre_plan = ? AND id_plan != ?'
    pool.query(flagNombre_plan, [request.body.nombre_plan,id_plan],(error, result) => {
        if (result != 0){
            response.send({message: 'No se pudo actualizar el plan. Ya existe otro plan con ese nombre.'});
        }
        else{
            let query = 'UPDATE planes SET ?, updated_at = now() WHERE id_plan = ?'
            pool.query(query, [request.body, id_plan],(error, result) => {
                if (error) throw error;
                response.send({message: 'Plan actualizado con exito.'});
            }); 
        }
    });
}

planesCtrl.desactivarPlan = (request, response) => {
    const id_plan = request.params.id_plan;
    let query = 'UPDATE planes SET updated_at = now(), estado = 0 WHERE id_plan = ?'
    pool.query(query, id_plan,(error, result) => {
        if (error) {
            throw error;
        }
        response.send({message: 'Plan inactivado.'});
    }); 
}

planesCtrl.activarPlan = (request, response) => {
    const id_plan = request.params.id_plan;
    let query = 'UPDATE planes SET updated_at = now(), estado = 1 WHERE id_plan = ?'
    pool.query(query, id_plan,(error, result) => {
        if (error) {
            throw error;
        }
        response.send({message: 'Plan activado'});
    }); 
}

module.exports = planesCtrl