const pool = require('../data/config');
const jobsCtrl = {}



jobsCtrl.obtenerDatosDescargas = (request,response) => {
    pool.query('SELECT id_descarga, Fecha_Des, Fecha_Has FROM descarga WHERE id_Company = ?', request.params.idCompany, (error, result) => {
        if (error) throw error;
        response.send(result);
    });
}


jobsCtrl.obtenerIdPost = (request, response) => {
    //'SELECT id_post FROM posts WHERE id_descarga = ?'
    pool.query('SELECT id_post FROM posts WHERE id_descarga=? AND published_date BETWEEN  ? AND  ?', [request.body.idDescarga, request.body.fechaDesde, request.body.fechaHasta], (error, result) => {
        if (error) throw error;
        if (result.length!=0){
            let listaIdPost = JSON.stringify(result).split(",");
            let auxListaIdPost = [];
            for (let i=0 ; i<listaIdPost.length ; i++){
                auxListaIdPost.push(listaIdPost[i].split(":")[1].split("}")[0]);
            }
            response.send(auxListaIdPost);
        }else{
            response.send(result)
        }
        
        // console.log("\n\n\n--------------------------------------------------------------------------------------\n")
        // console.log("descarga seleccionada: " + request.params.idDescarga)
        // console.log("lista de posts: " + auxListaIdPost)
        // console.log("\n------------------------------------------------\n")
        
    });
}


jobsCtrl.obtenerIdUser = (request, response) => {
    pool.query('SELECT id_user FROM comments WHERE idPost =?', request.params.idPost, (error, result) => {
        if (error) throw error;
        let listaIdUser = JSON.stringify(result).split(",");
        // console.log(listaIdUser)
        let auxListaIdUser = []
        for (let i=0 ; i<listaIdUser.length ; i++){
            auxListaIdUser.push(listaIdUser[i].split(":")[1].split("}")[0]);
        }
        // console.log("lista de users del post " + request.params.idPost + " : " + [...new Set(auxListaIdUser)])
        // console.log("\n------------------------------------------------\n")
        response.send(auxListaIdUser)
    });
}


jobsCtrl.obtenerJobs = (request, response) =>{
    pool.query('SELECT job FROM users WHERE id_user =?', request.params.idUser, (error, result) => {
        let job = String(JSON.stringify(result).split(":")[1].split('"')[1]).toLowerCase()
        let areaJob
        let raices
        let raiz
        raizEncontrada = false
        pool.query('SELECT area, raices FROM diccionario', (error2, result2) => {
            let i = 0
            let j
            while(i<result2.length || !raizEncontrada){
                raices = JSON.stringify(result2[i].raices).split('"')[1].split("*")
                for(j=0 ; j<raices.length ; j++){
                    if(!raizEncontrada){
                        raiz = String(raices[j])
                        //console.log("raiz a analizar: " + raiz)
                        if(job.includes(raiz)){
                            areaJob = String(JSON.stringify(result2[i].area).split('"')[1])
                            raizEncontrada = true
                        }
                    }
                }
                i++
            }
            response.send(areaJob);
            // console.log("idUser: " + request.params.idUser)     
            // console.log("job: " + job)    
            // console.log("area: " + areaJob) 
            // console.log("\n-----------------------------\n")          
        });
        if (error) throw error;
    });
}


module.exports = jobsCtrl