const pool = require('../data/config');
const usersPortalCtrl = {}
const passw = require('../passwordGenerator')
const nodemailer = require('nodemailer')



usersPortalCtrl.login = (req, res) => {

    const { email, password } = req.body

    // devuelve el objeto user 
    const query = `call sp_get_user_MD5('${email}','${password}');`

    pool.query(query, (error, result) => {
        if (error) throw error

        // [resultado] = result[0] necesario [resultado] al usar procedimiento
        const [resultado] = result[0]

        // resultado?.id_rol == 1 super admin
        // resultado?.id_rol == 2 admin
        // resultado?.id_rol == 3 user
        if(resultado?.id_rol){
            if(resultado.estado==1){
                return res.status(200).send(resultado)
            }else{
                return res.status(403).send({
                    message: "usuario desactivado"
                })
            }
        }else{
            return res.status(404).send({
                message: "usuario no econtrado"
            })
        }
    })
}

usersPortalCtrl.userExist = async(email, rut) => {

    const promisePool = pool.promise()

    const queryUserExist = `select * from usuarios where usuarios.correo_electronico='${email}' or usuarios.rut_usuario='${rut}';`
        // devuelve un objeto {existe: 'true'} || {existe: 'false'}

    const [user] = await promisePool.query(queryUserExist)
    console.log(user)
    if(user.length>0){
        return true
    }
    return false;
}

usersPortalCtrl.userIdExist = async(idUsuario) => {

    const promisePool = pool.promise()
    const queryUserExist = `call sp_user_id_exist('${idUsuario}');`

    // devuelve un objeto {existe: 'true'} || {existe: 'false'}
    const [
        [
            [user]
        ], fields
    ] = await promisePool.query(queryUserExist)
        // console.log(user['existe'])
    if (user['existe'] == 'true') {
        console.log("entra aca")
        return true
    }
    return false;
}




usersPortalCtrl.registerUser = async(req, res) => {

    const { nombre_usuario, correo_electronico, rut_usuario, dni, id_cliente, id_rol, estado } = req.body

    const pass = passw.generatePassword()

    const query = `call sp_agregar_usuario('${nombre_usuario}','${correo_electronico}','${rut_usuario}','${dni}','${id_cliente}',MD5('${pass}'), '${id_rol}', '${estado}'  );`

    // si existe el email o rut en la base de datos retorna true
    if (await usersPortalCtrl.userExist(correo_electronico, rut_usuario) == true) {

            return res.status(409).send({
                message: "email o rut ya registrado"
            });
    } else {
        pool.query(query, (error, result) => {
            if (error) throw error

            // plantilla correo electronico
            const from = "Registro, Analiza tu empresa";
            const to = correo_electronico;
            const subject = "Registro de usuario";
            const html = `
            <body style="background-color: #0077b6; display: flex; flex-direction: column; padding: 0; margin: 0; justify-content: space-between; overflow: hidden;">
                <div style="width:100%; margin-top: 30px; background-image: url('https://i.postimg.cc/C1Ps2PP6/wave.png'); background-size: cover; background-position: 0% -100%; min-height: 600px; background-repeat: no-repeat; ">
                    <h1 style="text-align: center; color: #ffe8d6; font-size: 3em; border: 0; padding: 0; font-family: 'Times New Roman';">Gracias Por Registrarte! </h1>
                    <h2 style="text-align: center; color: #ffe8d6; font-size: 2em;"">Tu contraseña es:</h2>
                    <div style="text-align: center; background-color: rgba(255, 232, 214, 0.863); width: 250px; padding: 50px; margin: 0 auto; border-radius: 10px;"><h3 style="text-align: center; color: #ffb703; font-size: 2.5em; text-decoration: underline;">${pass}</h3></div>
                </div>
            </body>`;
            // enviar correo electronico
            usersPortalCtrl.sendMail(from, to, subject, pass, html)
            return res.status(200).send({
                message: "Usuario registrado con éxito, la contraseña ha sido enviada a su correo"
            })
        })
    }
}

// método que es llamado una vez se registra un cliente
usersPortalCtrl.registerUserClient = async (cliente)=> {

    const { correo_electronico, dni, id_cliente, id_rol, estado } = cliente
    const nombre_usuario = cliente.razon_social
    const rut_usuario = cliente.rut_cliente

    const pass = passw.generatePassword()


    console.log(cliente)

    const query = `call sp_agregar_usuario('${nombre_usuario}','${correo_electronico}','${rut_usuario}','${dni}','${id_cliente}',MD5('${pass}'), '${id_rol}', '${estado}'  );`

    // si existe el email o rut en la base de datos retorna true
    if (await usersPortalCtrl.userExist(correo_electronico, rut_usuario) == true) {

            return false
    } else {
        pool.query(query, (error, result) => {
            if (error) throw error

            // plantilla correo electronico
            const from = "Registro, Analiza tu empresa";
            const to = correo_electronico;
            const subject = "Registro de usuario";
            const html = `
            <body style="background-color: #0077b6; display: flex; flex-direction: column; padding: 0; margin: 0; justify-content: space-between; overflow: hidden;">
                <div style="width:100%; margin-top: 30px; background-image: url('https://i.postimg.cc/C1Ps2PP6/wave.png'); background-size: cover; background-position: 0% -100%; min-height: 600px; background-repeat: no-repeat; ">
                    <h1 style="text-align: center; color: #ffe8d6; font-size: 3em; border: 0; padding: 0; font-family: 'Times New Roman';">Gracias Por Registrarte! </h1>
                    <h2 style="text-align: center; color: #ffe8d6; font-size: 2em;"">Tu contraseña es:</h2>
                    <div style="text-align: center; background-color: rgba(255, 232, 214, 0.863); width: 250px; padding: 50px; margin: 0 auto; border-radius: 10px;"><h3 style="text-align: center; color: #ffb703; font-size: 2.5em; text-decoration: underline;">${pass}</h3></div>
                </div>
            </body>`;
            // enviar correo electronico
            usersPortalCtrl.sendMail(from, to, subject, pass, html)
            return true
        })
    }
}


usersPortalCtrl.deleteUser = async(req, res) => {


    const { id } = req.params
    console.log(id);

    if (await usersPortalCtrl.userIdExist(id) == true) {

        const query = `call sp_eliminar_usuario('${id}')`

        pool.query(query, (err, result) => {
            if (err) throw err

            return res.status(200).send({
                message: "Usuario eliminado con exito"
            })
        })

    } else {
        return res.status(404).send({
            message: "No se encontró el id de usuario"
        })
    }
}


usersPortalCtrl.activateUser = async(req, res)=>{

    const { id } = req.params
    console.log(id);

    if (await usersPortalCtrl.userIdExist(id) == true) {

        const query = `update usuarios set usuarios.estado=1 where usuarios.id_usuario='${id}';`

        pool.query(query, (err, result) => {
            if (err) throw err

            return res.status(200).send({
                message: "Usuario activado con exito"
            })
        })

    } else {
        return res.status(404).send({
            message: "No se encontró el id de usuario"
        })
    }

}


// muestra todos los usuarios registrados no eliminados
usersPortalCtrl.listUsersSuperAdmin = (req, res) => {

    const query = `select usuarios.*, clientes.razon_social from usuarios JOIN clientes ON usuarios.id_cliente=clientes.id_cliente;`

    pool.query(query, (error, result) => {

        if (error) throw error
            // retorna un array de objetos usuarios
        return res.status(200).send(result)
    })
}

//muestra los usuarios que hacen referencia a la empresa del usuario admin
usersPortalCtrl.listUsersAdmin = (req, res) =>{

    const id_company = req.params.id_cliente
    const query = `select usuarios.*, clientes.razon_social from usuarios JOIN clientes ON usuarios.id_cliente=clientes.id_cliente where usuarios.id_cliente = '${id_company}';`

    pool.query(query, (error, result)=>{
        if(error) throw error

        return res.status(200).send(result)
    })
}



usersPortalCtrl.sendMail = (from, to, subject, pass, html) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'prueba.linkedin2022@gmail.com',
            pass: 'jykaiwzfxgodejac'
        }
    });

    let mailOptions = {
        "from": from,
        "to": to,
        "subject": subject,
        // "text": text+pass,
        "html": html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            error.status(500).send(error.message)
        } else {
            console.log("email enviado")
            info.status(200).jsonp(req.body)
        }
    })

}

// 
usersPortalCtrl.updateUserAdmin = async( req, res )=>{

    const id_usuario = req.params.id_usuario;
    console.log(JSON.stringify(req.body));
    //console.log()
    const {nombre_usuario, correo_electronico, estado} = req.body;

    // if (await usersPortalCtrl.userExist(email, rut_usuario) == true) {

    //     return res.status(409).send({
    //         message: "email o rut ya registrado"
    //     });
    // }else{
    if(await usersPortalCtrl.userIdExist(id_usuario) == true){
        const query =`update usuarios set usuarios.nombre_usuario = '${nombre_usuario}', usuarios.correo_electronico = '${correo_electronico}', usuarios.estado='${estado}', usuarios.updated_at=now() where usuarios.id_usuario = '${id_usuario}'`;

        pool.query(query, (error, result)=>{
            if (error) throw error

            return res.status(200).send({
                message: "Datos actualizados con exito"
            })
        });
    }else{
        return res.status(404).send({
            message: "Usuario no encontrado"
        })
    }
    // }
}


usersPortalCtrl.userIdPassExist = async(idUsuario, password) => {

    const promisePool = pool.promise()
    const queryUserExist = `select * from usuarios where usuarios.id_usuario='${idUsuario}' and usuarios.password_MD5= MD5('${password}')`

    console.log(idUsuario)
    console.log(password)
    // devuelve un objeto {existe: 'true'} || {existe: 'false'}
    const [user] = await promisePool.query(queryUserExist)
        // console.log(user['existe'])
    
    console.log(user)


    if(user.length>0) return true

    return false;
}

usersPortalCtrl.updatePassword = async(req, res) =>{

    const idUsuario = req.params.id_usuario;
    const {password, newPassword}  = req.body

    console.log(JSON.stringify(req.params))


    console.log("llega aca")
    console.log(idUsuario);
    console.log(password);
    console.log(newPassword);
    console.log("llega aca 2");
    if(await usersPortalCtrl.userIdPassExist(idUsuario, password) == true){
        
        const query = `update usuarios set usuarios.password_MD5= MD5('${newPassword}') where usuarios.id_usuario='${idUsuario}';`

        pool.query(query, (err, result)=>{
            if(err) throw err

            return res.status(200).send({
                message: "contraseña actualizada"
            })
        })

    }else{
        return res.status(404).send({
            message: "Password incorrecta"
        })
    }


}


module.exports = usersPortalCtrl