const pool = require('../data/config');
const clientesTipo2Ctrl = {}
const usersPortalCtrl = require('./users.portal.controllers')

//MOSTRAR TODOS LOS CLIENTES DE TIPO 2
clientesTipo2Ctrl.mostrarClientesTipo2 = (request, response) => {
    let query = 'SELECT * FROM clientes'
    pool.query(query,(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

//MOSTRAR SOLO UN CLIENTE DE TIPO 2
clientesTipo2Ctrl.mostrarClienteTipo2 = (request, response) => {
    let query = 'SELECT * FROM clientes WHERE id_cliente =?'
    pool.query(query, request.params.id_cliente,(error, result) => {
        if (error) throw error;
        response.send(result);
    });
}

//AGREGA UN CLIENTE DE TIPO 2
clientesTipo2Ctrl.agregarClienteTipo2 = (request, response) => {
    let query = 'SELECT * FROM clientes WHERE correo_electronico=?'
    pool.query(query, request.body.correo_electronico,(error, result) => {
        if (result.length != 0) {
            response.status(400).send({message: 'Cliente ya existe'});
        }
        else {
            query = 'INSERT INTO clientes SET created_at=now(), updated_at=now(), estado=1, ?'
            pool.query(query, request.body,(error, result) => {
                if (error) throw error;

                queryGetCliente = `select * from clientes where clientes.correo_electronico='${request.body.correo_electronico}'`
                
                pool.query(queryGetCliente, (error, result)=>{
                    if(error) throw error
                        
                        usersPortalCtrl.registerUserClient(result[0])
                        
                })
                response.send({message: 'Cliente creado con éxito'});
               
            });
        }
    });
}

//EDITAR UN CLIENTE DE TIPO 2
clientesTipo2Ctrl.editarClienteTipo2 = (request, response) => {
    let cont = 0;
    let queryRut_cliente = 'SELECT rut_cliente FROM clientes WHERE rut_cliente=? AND id_cliente != ?'
    let queryCorreo_electronico = 'SELECT correo_electronico FROM clientes WHERE correo_electronico=? AND id_cliente != ?'
    let query = 'UPDATE clientes SET ?, updated_at = now() WHERE id_cliente = ?'

//REVISA EL RUT-----------------------------------------------------------------------------------------------
    pool.query(queryRut_cliente, [request.body.rut_cliente, request.params.id_cliente], (error, result) => {
        if (result.length != 0) {
            console.log("rut: " + request.body.rut_cliente);
            cont += 1;
        }   

//REVISA EL CORREO----------------------------------------------------------------------------------------------
        pool.query(queryCorreo_electronico, [request.body.correo_electronico, request.params.id_cliente], (error, result) => {
            if (result.length != 0) {
                console.log("correo: " + request.body.correo_electronico);
                cont = cont + 2;
            }
            console.log("cont 1: " + cont)
 
//ACTUALIZA EL OBJETO-------------------------------------------------------------------------------------------            
            if (cont == 0) {
                console.log("back: " + JSON.stringify(request.body));
                pool.query(query, [request.body, request.params.id_cliente], (error, result) => {
                    response.send({ message: 'Datos de cliente actualizados con éxito' })
                    console.log("Datos de cliente actualizados con éxito")
                });
            }
            console.log("cont 2: " + cont)
            if (cont == 1) {
                console.log("No se puedieron actualizar los datos ya que el rut ya existe")
            }
            console.log("cont 3: " + cont)
            if (cont == 2) {
                console.log("No se puedieron actualizar los datos ya que el correo ya existe")
            }
            if (cont == 3) {
                console.log("No se puedieron actualizar los datos ya que el rut y el correo ya existen")
            }
        });
    });
}

//CAMBIA DE ESTADO  A 0 EN CASO DE QUE SE QUIERA ELIMINAR
clientesTipo2Ctrl.desactivarClienteTipo2 = (request, response) => {
    let query = 'UPDATE clientes SET estado = 0 WHERE id_cliente =?'
    pool.query(query,request.params.id_cliente,(error, result) => {
        if (error) throw error;
        response.send({message: 'Cliente desactivado con éxito'})
    });    
}

//CAMBIA DE ESTADO  A 0 EN CASO DE QUE SE QUIERA ELIMINAR
clientesTipo2Ctrl.activarClienteTipo2 = (request, response) => {
    let query = 'UPDATE clientes SET estado = 1 WHERE id_cliente =?'
    pool.query(query,request.params.id_cliente,(error, result) => {
        if (error) throw error;
        response.send({message: 'Cliente reactivado con éxito'})
    });    
}

module.exports = clientesTipo2Ctrl