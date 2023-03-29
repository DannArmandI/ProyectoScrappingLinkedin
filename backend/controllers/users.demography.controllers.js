const { json } = require('body-parser');
const pool = require('../data/config');
const usersDemography = {}








usersDemography.getInstitutionReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryEducation = `SELECT users.*, education_institution.institution, education_degree.degree FROM users LEFT JOIN education_institution ON education_institution.id_user=users.id_user 
            left JOIN education_degree ON education_degree.id_institution_user=education_institution.id_institution JOIN reactions ON reactions.id_user=users.id_user left 
            JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' 
            AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`


            
        const [usersQueryEd] = await promisePool.query(queryEducation)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEd = usersQueryEd.reduce((usersObj, user)=>{
                
            let {id_user, name, institution, degree} = user
            idUserStr = id_user.toString()

            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["educations"] = usersObj[idUserStr]["educations"] || {}

            usersObj[idUserStr]["educations"][institution] = (usersObj[idUserStr])[institution] || []
            
            usersObj[idUserStr]["educations"][institution].push(degree)

            return usersObj
        },{})
        
        // INDEXADO POR NOMBRE INSTITUCION 
        let educations = Object.values(usersEd).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            for(let education in user.educations){
                
                education == "" || education=='null' || education == null ? education = "sin información" : education=education
                
                console.log(education)

                usersObj[education] = usersObj[education] || {}
                usersObj[education]["category"] = usersObj[education]["category"] || education
                usersObj[education]["values"] = usersObj[education]["values"]+1 || 1
            }

            return usersObj
        },{})
        return res.status(200).send(Object.values(educations))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getProfessionReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryEducation = `SELECT users.*, education_institution.institution, education_degree.degree FROM users LEFT JOIN education_institution ON education_institution.id_user=users.id_user 
            left JOIN education_degree ON education_degree.id_institution_user=education_institution.id_institution JOIN reactions ON reactions.id_user=users.id_user left 
            JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' 
            AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`

        const [usersQueryEd] = await promisePool.query(queryEducation)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEd = usersQueryEd.reduce((usersObj, user)=>{
                
            let {id_user, name, institution, degree} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["educations"] = usersObj[idUserStr]["educations"] || {}

            usersObj[idUserStr]["educations"][institution] = (usersObj[idUserStr])[institution] || []
            
            usersObj[idUserStr]["educations"][institution].push(degree)

            return usersObj
        },{})
        
        
        // INDEXADO POR NOMBRE DE PROFESION
        let educations = Object.values(usersEd).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            for(let prefesiones in user.educations){
               
                user.educations[prefesiones].map((profesion)=>{
                    

                    profesion == "" || profesion == 'null' || profesion == null  ? profesion = "sin información" : profesion=profesion
                    console.log(profesion)

                    

                    usersObj[profesion] = usersObj[profesion]  || {}
                    usersObj[profesion]["category"] = usersObj[profesion]["category"] || profesion
                    usersObj[profesion]["values"] = usersObj[profesion]["values"] + 1 || 1
                })

            }

            return usersObj
        },{})

        return res.status(200).send(Object.values(educations))
    }catch(err){
        console.error(err)
    }
    
})


usersDemography.getCountryReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryCountry = `SELECT users.*
        FROM users LEFT JOIN reactions ON reactions.id_user=users.id_user left JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`

        const [usersQueryCountry] = await promisePool.query(queryCountry)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersCountries = usersQueryCountry.reduce((usersObj, user)=>{
                
            let {id_user, name, country, location} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["ubication"] = usersObj[idUserStr]["ubication"] || {}

            usersObj[idUserStr]["ubication"]["country"] = usersObj[idUserStr]["ubication"]["country"] || country

            usersObj[idUserStr]["ubication"]["location"] = usersObj[idUserStr]["ubication"]["location"] || location

            return usersObj
        },{})
        
        
        // INDEXADO POR PAIS
        let countries = Object.values(usersCountries).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            let country = user.ubication.country.trim()
            
            country == "" || country == 'null' || country == null ? country = "sin información" : country=country
            

            usersObj[country] = usersObj[country] || {}
            usersObj[country]["category"] = usersObj[country]["category"] || country
            usersObj[country]["values"] = usersObj[country]["values"] + 1 || 1

            return usersObj
        },{})

        return res.status(200).send(Object.values(countries))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getLocationReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryCountry = `SELECT users.*
        FROM users LEFT JOIN reactions ON reactions.id_user=users.id_user left JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`

        const [usersQueryCountry] = await promisePool.query(queryCountry)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersCountries = usersQueryCountry.reduce((usersObj, user)=>{
                
            let {id_user, name, country, location} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["ubication"] = usersObj[idUserStr]["ubication"] || {}

            usersObj[idUserStr]["ubication"]["country"] = usersObj[idUserStr]["ubication"]["country"] || country

            usersObj[idUserStr]["ubication"]["location"] = usersObj[idUserStr]["ubication"]["location"] || location

            return usersObj
        },{})
        
        
        // INDEXADO POR LOCACIÓN
        let locations = Object.values(usersCountries).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            let {location} = user.ubication
            location = location.trim()
            

            location == "" || location == 'null' || location == null ? location = "sin información" : location=location

            usersObj[location] = usersObj[location] || {}
            usersObj[location]["category"] = usersObj[location]["category"] || location
            usersObj[location]["values"] = usersObj[location]["values"] + 1 || 1

            return usersObj
        },{})


   
        return res.status(200).send(Object.values(locations))
    }catch(err){
        console.error(err)
    }
    
})



usersDemography.getCompanyReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryExperience = `SELECT users.*, experience_location.company, experience_work.job  FROM users LEFT JOIN experience_location ON experience_location.id_user=users.id_user 
        left JOIN experience_work ON experience_work.id_experience_location=experience_location.id_experience JOIN reactions ON reactions.id_user=users.id_user left JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}'`


            
        const [usersQueryEx] = await promisePool.query(queryExperience)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEx = usersQueryEx.reduce((usersObj, user)=>{
                
            let {id_user, name, company, job} = user
            idUserStr = id_user.toString()

            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["experiences"] = usersObj[idUserStr]["experiences"] || {}

            usersObj[idUserStr]["experiences"][company] = (usersObj[idUserStr])[company] || []
            
            usersObj[idUserStr]["experiences"][company].push(job)

            return usersObj
        },{})
        
        // INDEXADO POR NOMBRE COMPAÑIA 
        let experiences = Object.values(usersEx).reduce( (usersObj, user)=>{

            for(let company in user.experiences){
                
                company == "" || company=='null' || company == null ? company = "sin información" : company=company
                
                console.log(company)

                usersObj[company] = usersObj[company] || {}
                usersObj[company]["category"] = usersObj[company]["category"] || company
                usersObj[company]["values"] = usersObj[company]["values"]+1 || 1
            }

            return usersObj
        },{})
        return res.status(200).send(Object.values(experiences))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getJobReactionsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryExperience = `SELECT users.*, experience_location.company, experience_work.job  FROM users LEFT JOIN experience_location ON experience_location.id_user=users.id_user 
        left JOIN experience_work ON experience_work.id_experience_location=experience_location.id_experience JOIN reactions ON reactions.id_user=users.id_user left JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}'`

        const [usersQueryEx] = await promisePool.query(queryExperience)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEx = usersQueryEx.reduce((usersObj, user)=>{
                
            let {id_user, name, company, job} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["experiences"] = usersObj[idUserStr]["experiences"] || {}

            usersObj[idUserStr]["experiences"][company] = (usersObj[idUserStr])[company] || []
            
            usersObj[idUserStr]["experiences"][company].push(job)

            return usersObj
        },{})
        
        
        // INDEXADO POR NOMBRE DE CARGO
        let experiences = Object.values(usersEx).reduce( (usersObj, user)=>{

            

            for(let experiencias in user.experiences){
              
                user.experiences[experiencias].map((experiencia)=>{
                    

                    experiencia == "" || experiencia == 'null' || experiencia == null  ? experiencia = "sin información" : experiencia=experiencia
                    console.log(experiencia)

                    

                    usersObj[experiencia] = usersObj[experiencia]  || {}
                    usersObj[experiencia]["category"] = usersObj[experiencia]["category"] || experiencia
                    usersObj[experiencia]["values"] = usersObj[experiencia]["values"] + 1 || 1
                })
            }
            return usersObj
        },{})

        return res.status(200).send(Object.values(experiences))
    }catch(err){
        console.error(err)
    }
    
})








usersDemography.getInstitutionCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryEducation = `SELECT users.*, education_institution.institution, education_degree.degree FROM users LEFT JOIN education_institution ON education_institution.id_user=users.id_user 
        left JOIN education_degree ON education_degree.id_institution_user=education_institution.id_institution JOIN comments ON comments.id_user=users.id_user left 
        JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' 
        AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';
`

        
            
        const [usersQueryEd] = await promisePool.query(queryEducation)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEd = usersQueryEd.reduce((usersObj, user)=>{
                
            let {id_user, name, institution, degree} = user
            idUserStr = id_user.toString()

            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["educations"] = usersObj[idUserStr]["educations"] || {}

            usersObj[idUserStr]["educations"][institution] = (usersObj[idUserStr])[institution] || []
            
            usersObj[idUserStr]["educations"][institution].push(degree)

            return usersObj
        },{})
        
        // INDEXADO POR NOMBRE INSTITUCION 
        let educations = Object.values(usersEd).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            for(let education in user.educations){
                // console.log(education)

                education == "null" || education == null || education==''  ? education="sin información" : education = education

                console.log(education)

                usersObj[education] = usersObj[education] || {}
                usersObj[education]["category"] = usersObj[education]["category"] || education
                usersObj[education]["values"] = usersObj[education]["values"]+1 || 1
            }

            return usersObj
        },{})
        return res.status(200).send(Object.values(educations))
    }catch(err){
        console.error(err)
    }
    
})



usersDemography.getProfessionCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryEducation = `SELECT users.*, education_institution.institution, education_degree.degree FROM users LEFT JOIN education_institution ON education_institution.id_user=users.id_user 
        left JOIN education_degree ON education_degree.id_institution_user=education_institution.id_institution JOIN comments ON comments.id_user=users.id_user left 
        JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' 
        AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`


        const [usersQueryEd] = await promisePool.query(queryEducation)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEd = usersQueryEd.reduce((usersObj, user)=>{
                
            let {id_user, name, institution, degree} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["educations"] = usersObj[idUserStr]["educations"] || {}

            usersObj[idUserStr]["educations"][institution] = (usersObj[idUserStr])[institution] || []
            
            usersObj[idUserStr]["educations"][institution].push(degree)

            return usersObj
        },{})
        
        
        // INDEXADO POR NOMBRE DE PROFESION
        let educations = Object.values(usersEd).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            for(let prefesiones in user.educations){
               
                user.educations[prefesiones].map((profesion)=>{
                    

                    profesion == "" || profesion==null || profesion=="null"  ? profesion = "sin información" : profesion=profesion
                    console.log(profesion)

                    

                    usersObj[profesion] = usersObj[profesion]  || {}
                    usersObj[profesion]["category"] = usersObj[profesion]["category"] || profesion
                    usersObj[profesion]["values"] = usersObj[profesion]["values"] + 1 || 1
                })

            }

            return usersObj
        },{})

        return res.status(200).send(Object.values(educations))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getCountryCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryCountry = `SELECT users.*
        FROM users LEFT JOIN comments ON comments.id_user=users.id_user left JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`

        const [usersQueryCountry] = await promisePool.query(queryCountry)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersCountries = usersQueryCountry.reduce((usersObj, user)=>{
                
            let {id_user, name, country, location} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["ubication"] = usersObj[idUserStr]["ubication"] || {}

            usersObj[idUserStr]["ubication"]["country"] = usersObj[idUserStr]["ubication"]["country"] || country

            usersObj[idUserStr]["ubication"]["location"] = usersObj[idUserStr]["ubication"]["location"] || location

            return usersObj
        },{})
        
        
        // INDEXADO POR PAIS
        let countries = Object.values(usersCountries).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            let country = user.ubication.country.trim()
            
            country == "" || country == 'null' || country == null ? country = "sin información" : country=country
            

            usersObj[country] = usersObj[country] || {}
            usersObj[country]["category"] = usersObj[country]["category"] || country
            usersObj[country]["values"] = usersObj[country]["values"] + 1 || 1

            return usersObj
        },{})

        return res.status(200).send(Object.values(countries))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getLocationCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryCountry = `SELECT users.*
        FROM users LEFT JOIN comments ON comments.id_user=users.id_user left JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`

        const [usersQueryCountry] = await promisePool.query(queryCountry)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersCountries = usersQueryCountry.reduce((usersObj, user)=>{
                
            let {id_user, name, country, location} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["ubication"] = usersObj[idUserStr]["ubication"] || {}

            usersObj[idUserStr]["ubication"]["country"] = usersObj[idUserStr]["ubication"]["country"] || country

            usersObj[idUserStr]["ubication"]["location"] = usersObj[idUserStr]["ubication"]["location"] || location

            return usersObj
        },{})
        
        
        // INDEXADO POR LOCACIÓN
        let locations = Object.values(usersCountries).reduce( (usersObj, user)=>{

            // let {institution} = user.educations

            let {location} = user.ubication
            location = location.trim()
            

            location == "" || location == 'null' || location == null ? location = "sin información" : location=location

            usersObj[location] = usersObj[location] || {}
            usersObj[location]["category"] = usersObj[location]["category"] || location
            usersObj[location]["values"] = usersObj[location]["values"] + 1 || 1

            return usersObj
        },{})


   
        return res.status(200).send(Object.values(locations))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getCompanyCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryExperience = `SELECT users.*, experience_location.company, experience_work.job  FROM users LEFT JOIN experience_location ON experience_location.id_user=users.id_user 
        left JOIN experience_work ON experience_work.id_experience_location=experience_location.id_experience JOIN comments ON comments.id_user=users.id_user left JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}'`


            
        const [usersQueryEx] = await promisePool.query(queryExperience)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEx = usersQueryEx.reduce((usersObj, user)=>{
                
            let {id_user, name, company, job} = user
            idUserStr = id_user.toString()

            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["experiences"] = usersObj[idUserStr]["experiences"] || {}

            usersObj[idUserStr]["experiences"][company] = (usersObj[idUserStr])[company] || []
            
            usersObj[idUserStr]["experiences"][company].push(job)

            return usersObj
        },{})
        
        // INDEXADO POR NOMBRE COMPAÑIA 
        let experiences = Object.values(usersEx).reduce( (usersObj, user)=>{

            for(let company in user.experiences){
                
                company == "" || company=='null' || company == null ? company = "sin información" : company=company
                
                console.log(company)

                usersObj[company] = usersObj[company] || {}
                usersObj[company]["category"] = usersObj[company]["category"] || company
                usersObj[company]["values"] = usersObj[company]["values"]+1 || 1
            }

            return usersObj
        },{})
        return res.status(200).send(Object.values(experiences))
    }catch(err){
        console.error(err)
    }
    
})

usersDemography.getJobCommentsUsers = (async(req, res)=>{

    try{

        promisePool = pool.promise()

        const { id_descarga, fecha_desde, fecha_hasta} = req.body

        const queryExperience = `SELECT users.*, experience_location.company, experience_work.job  FROM users LEFT JOIN experience_location ON experience_location.id_user=users.id_user 
        left JOIN experience_work ON experience_work.id_experience_location=experience_location.id_experience JOIN comments ON comments.id_user=users.id_user left JOIN posts ON posts.id_post=comments.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}'`

        const [usersQueryEx] = await promisePool.query(queryExperience)

        // INDEXANDO USUARIOS POR ID Y ELIMINANDO DUPLICADOS
        let usersEx = usersQueryEx.reduce((usersObj, user)=>{
                
            let {id_user, name, company, job} = user
            idUserStr = id_user.toString()


            usersObj[idUserStr] = usersObj[idUserStr] || {}

            usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name

            usersObj[idUserStr]["experiences"] = usersObj[idUserStr]["experiences"] || {}

            usersObj[idUserStr]["experiences"][company] = (usersObj[idUserStr])[company] || []
            
            usersObj[idUserStr]["experiences"][company].push(job)

            return usersObj
        },{})
        
        
        // INDEXADO POR NOMBRE DE CARGO
        let experiences = Object.values(usersEx).reduce( (usersObj, user)=>{

            

            for(let experiencias in user.experiences){
              
                user.experiences[experiencias].map((experiencia)=>{
                    

                    experiencia == "" || experiencia == 'null' || experiencia == null  ? experiencia = "sin información" : experiencia=experiencia
                    console.log(experiencia)

                    

                    usersObj[experiencia] = usersObj[experiencia]  || {}
                    usersObj[experiencia]["category"] = usersObj[experiencia]["category"] || experiencia
                    usersObj[experiencia]["values"] = usersObj[experiencia]["values"] + 1 || 1
                })
            }
            return usersObj
        },{})

        return res.status(200).send(Object.values(experiences))
    }catch(err){
        console.error(err)
    }
    
})


// function formatearCadena(cadena){

//     const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','ñ':'n','Ñ':'N',};
//     let cadena2 = cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	

//     console.log(cadena2)
//     return cadena2

// }







// metodo post
// usersDemography.getDataReactionsUser = ( async( req, res)=>{

//     try{
//         const { id_descarga, fecha_desde, fecha_hasta} = req.body


//         const promisePool = pool.promise()
//         const queryEducation = `SELECT users.*, education_institution.institution, education_degree.degree FROM users LEFT JOIN education_institution ON education_institution.id_user=users.id_user 
//         left JOIN education_degree ON education_degree.id_institution_user=education_institution.id_institution JOIN reactions ON reactions.id_user=users.id_user left 
//         JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' 
//         AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`
    
//         const [usersQueryEd] = await promisePool.query(queryEducation)
        
        
//         // INDEXANDO DATOS

//         // une las propiedades education dentro del mismo usuario
//         // para eliminar datos duplicados
//         let usersEd = usersQueryEd.reduce((usersObj, user)=>{
            
//             let {id_user, name, country, location, company, degree} = user
//             idUserStr = id_user.toString()
    
    
//             usersObj[idUserStr] = usersObj[idUserStr] || {}
    
//             usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name
    
//             usersObj[idUserStr]["country"] = usersObj[idUserStr]["country"] || country
    
//             usersObj[idUserStr]["location"] = usersObj[idUserStr]["location"] || location
    
//             usersObj[idUserStr]["educations"] = usersObj[idUserStr]["educations"] || {}
    
//             usersObj[idUserStr]["educations"][company] = (usersObj[idUserStr])[company] || []
            
//             usersObj[idUserStr]["educations"][company].push(degree)
    
//             return usersObj
//         },{})
    
//         const queryExperience = `SELECT users.*, experience_location.company, experience_work.job 
//         FROM users LEFT JOIN experience_location ON experience_location.id_user=users.id_user left JOIN experience_work ON experience_work.id_experience_location=experience_location.id_experience JOIN reactions ON reactions.id_user=users.id_user left JOIN posts ON posts.id_post=reactions.idPost left JOIN descarga on descarga.id_descarga=posts.id_descarga WHERE descarga.id_descarga='${id_descarga}' AND posts.published_date BETWEEN '${fecha_desde}' AND '${fecha_hasta}';`
    
//         const [usersQueryEx] = await promisePool.query(queryExperience)
        
//         let users = usersQueryEx.reduce(( usersObj, user)=>{
    
//             let {id_user, name, country, location, company, job} = user
//             idUserStr = id_user.toString()
    
//             usersObj[idUserStr] = usersObj[idUserStr] || {}
    
//             usersObj[idUserStr]["name"] = usersObj[idUserStr]["name"] || name
    
//             usersObj[idUserStr]["country"] = usersObj[idUserStr]["country"] || country
    
//             usersObj[idUserStr]["location"] = usersObj[idUserStr]["location"] || location
    
//             usersObj[idUserStr]["experiences"] = usersObj[idUserStr]["experiences"] || {}
    
//             usersObj[idUserStr]["experiences"][company] = (usersObj[idUserStr])[company] || []
            
//             usersObj[idUserStr]["experiences"][company].push(job)
    
//             return usersObj
//         },usersEd)
    
//         return res.status(200).send(Object.values(users))
//     }catch(err){
//         console.error(err)
//     }
// })


usersDemography.getDescargasCliente = ((req, res)=>{

    const {id_company} = req.params

    const query = `select * from descarga where descarga.id_Companie='${id_company}'`

    pool.query(query, (error, result)=>{

        if(error) throw error

        return res.status(200).send(result)

    })
})




module.exports = usersDemography