
const companiesCtrl = require('../controllers/companies.controllers')
const commentsCtrl = require('../controllers/comments.controllers')
const postsCtrl = require('../controllers/posts.controllers')
const reactionsCtrl = require('../controllers/reactions.controllers')
const usersCtrl = require('../controllers/users.controllers')
const followersCtrl = require('../controllers/followers.controllers')
const extractionsCtrl = require('../controllers/extractions.controllers')
const accountsCtrl = require('../controllers/accounts.controllers')
const descargaCtrl= require('../controllers/descarga.controllers')
const usersPortalCtrl = require('../controllers/users.portal.controllers')
const usersDemography = require('../controllers/users.demography.controllers')
const planesCtrl = require('../controllers/planes.controllers')
const clientesTipo2Ctrl = require('../controllers/clientesTipo2.controllers')
const sentimientosCtrl = require('../controllers/sentimientos.controllers')
const jobsCtrl = require('../controllers/jobs.controllers')
// Display all companies
const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });
    //extractions downloads
    app.get('/api/downloads/:id',descargaCtrl.getDownloads)
    app.get('/api/downloads_done/:id',descargaCtrl.getDownloadsDone)
    app.post('/api/downloads/Add',descargaCtrl.AgregarDownload)
    app.post('/api/downloads/:id',descargaCtrl.editDownload)
    app.delete('/api/downloads/:id',descargaCtrl.DeleteDownload)
    app.put('/api/downloads/:id',descargaCtrl.ActivateDownload)
    //extractions routes
    app.get('/api/extractions', extractionsCtrl.getExtractions);
    app.post('/api/extractions', extractionsCtrl.addExtraction);
    app.put('/api/extractions/:id_extraction', extractionsCtrl.editExtraction);
    app.delete('/api/extractions/:id_extraction', extractionsCtrl.deleteExtraction);

    // accounts routes
    app.get('/api/accounts', accountsCtrl.getAccounts);
    app.get('/api/accounts/:id', accountsCtrl.getAccounts2);
    app.post('/api/accounts', accountsCtrl.addAccount);
    app.put('/api/accounts/:id_account', accountsCtrl.editAccount);
    app.delete('/api/accounts/:id_account', accountsCtrl.deleteAccount);
    app.put('/api/accounts/activate/:id_account', accountsCtrl.activateAccount);

    //companies routes
    app.get('/api/companies', companiesCtrl.getCompanies);
    app.get('/api/companies/:cliente', companiesCtrl.getCompanies2);
    app.get('/api/companies_download/:cliente', companiesCtrl.getCompanies2Download);
    app.get('/api/companies_download_sa', companiesCtrl.getCompanies2DownloadSA);
    app.post('/api/companies/query_between_dates', companiesCtrl.getCompaniesBetweenDates);
    app.post('/api/companies/Agregar',companiesCtrl.AgregarCompanies);
    app.put('/api/companies/Actualizar/:id',companiesCtrl.ActualizarCompanies);
    app.put('/api/companies/Activar/:id',companiesCtrl.ActivarCompanies);
    app.delete('/api/companies/Eliminar/:id',companiesCtrl.EliminarCompanies);
    //comments routes
    app.get('/api/comments', commentsCtrl.getComments);
    app.get('/api/comments/:id_post', commentsCtrl.getPostComments);
    app.post('/api/comments/:id_post/query_between_dates', commentsCtrl.getPostCommentsBetweenDates);
    app.get('/api/comments/company/:id_company',commentsCtrl.getCompanyComments)

    //posts routes
    app.get('/api/posts',postsCtrl.getPosts);
    app.get('/api/posts/descarga/:id_descarga',postsCtrl.getPostsDescarga);
    app.get('/api/posts/:id_company', postsCtrl.getPostsCompany);
    app.post('/api/posts/:id_company/query_between_dates', postsCtrl.getPostCompaniesBetweenDates);
    app.post('/api/posts/:id_company/reactions_between_dates', postsCtrl.getPostReactionsBetweenDates);
    app.post('/api/posts/:id_company/comments_between_dates', postsCtrl.getPostCommentsBetweenDates);
    app.get('/api/posts/post/category/tags', postsCtrl.getTags);
    app.put('/api/posts/post/category/update/:id_post', postsCtrl.editPost);
    
    //reactions routes
    app.get('/api/reactions', reactionsCtrl.getReactions);
    app.get('/api/reactions/:id_post', reactionsCtrl.getPostReactions);
    app.get('/api/reactions/company/:id_company', reactionsCtrl.getCompanyReactions);

    //users routes
    app.get('/api/users', usersCtrl.getUsers);
    app.post('/api/users/info', usersCtrl.getUser);
    app.get('/api/users/:id_company', usersCtrl.getCompanyUsers);
    app.get('/api/users/user/:id', usersCtrl.getUserById);

    //followers routes
    app.get('api/followers/:id_company', followersCtrl.getCompanyFollowers)
    app.post('api/followers/:id_company/query_between_dates', followersCtrl.queryFollowersBetweenDates)

    // usuarios Portal router
    app.post('/', usersPortalCtrl.login)
    app.post('/register', usersPortalCtrl.registerUser)
    app.put('/user/deactivate/:id',usersPortalCtrl.deleteUser)
    app.put('/user/activate/:id',usersPortalCtrl.activateUser)
    // app.put('/user/activate/:id',usersPortalCtrl.deleteUser)
    app.get('/Usuarios', usersPortalCtrl.listUsersSuperAdmin) //super admin => muestra todos los usuarios
    app.get('/admin/user/:id_cliente', usersPortalCtrl.listUsersAdmin) // admin => muestra los usuarios relacionados al cliente
    app.put('/update/:id_usuario', usersPortalCtrl.updateUserAdmin) // actualiza un usuario
    app.put('/update/password/:id_usuario', usersPortalCtrl.updatePassword)
    

    // planes routes
    app.get('/api/planes/mostrarTodos', planesCtrl.mostrarPlanes);
    app.get('/api/planes/mostrarUno/:id_plan', planesCtrl.mostrarPlan);
    app.post('/api/planes/agregar', planesCtrl.agregarPlan);
    app.put('/api/planes/editar/:id_plan', planesCtrl.editarPlan);
    app.delete('/api/planes/activar/:id_plan', planesCtrl.activarPlan);
    app.delete('/api/planes/desactivar/:id_plan', planesCtrl.desactivarPlan);
    

    //clientesTipo2 routes
    app.get('/clientesTipo2', clientesTipo2Ctrl.mostrarClientesTipo2);
    app.get('/clientesTipo2/mostrar/:id_cliente', clientesTipo2Ctrl.mostrarClienteTipo2);
    app.post('/clientesTipo2', clientesTipo2Ctrl.agregarClienteTipo2);
    app.put('/clientesTipo2/:id_cliente', clientesTipo2Ctrl.editarClienteTipo2);
    app.delete('/clientesTipo2/desactivar/:id_cliente', clientesTipo2Ctrl.desactivarClienteTipo2);
    app.delete('/clientesTipo2/activar/:id_cliente', clientesTipo2Ctrl.activarClienteTipo2);

    //sentimientos routes
    app.get('/sentimientos/obtenerDatosDescargas/:idCompany', sentimientosCtrl.obtenerDatosDescargas);
    app.post('/sentimientos/obtenerIdPost', sentimientosCtrl.obtenerIdPost);
    app.get('/sentimientos/obtenerSentimientos/:idPost', sentimientosCtrl.obtenerSentimientos);

    //jobs routes
    app.get('/jobs/obtenerDatosDescargas/:idCompany', jobsCtrl.obtenerDatosDescargas);
    app.post('/jobs/obtenerIdPost', jobsCtrl.obtenerIdPost);
    app.get('/jobs/obtenerIdUser/:idPost', jobsCtrl.obtenerIdUser);
    app.get('/jobs/obtenerJobs/:idUser', jobsCtrl.obtenerJobs);


    // demography
    app.get('/graphics/demography/descargas/:id_company', usersDemography.getDescargasCliente);
    // demography reactions
    app.post('/graphics/demography/reactions/institutions', usersDemography.getInstitutionReactionsUsers);
    app.post('/graphics/demography/reactions/degrees', usersDemography.getProfessionReactionsUsers);
    app.post('/graphics/demography/reactions/countries', usersDemography.getCountryReactionsUsers);
    app.post('/graphics/demography/reactions/locations', usersDemography.getLocationReactionsUsers);
    app.post('/graphics/demography/reactions/companys', usersDemography.getCompanyReactionsUsers);
    app.post('/graphics/demography/reactions/jobs', usersDemography.getJobReactionsUsers);
    // demography comments
    app.post('/graphics/demography/comments/institutions', usersDemography.getInstitutionCommentsUsers);
    app.post('/graphics/demography/comments/degrees', usersDemography.getProfessionCommentsUsers);
    app.post('/graphics/demography/comments/countries', usersDemography.getCountryCommentsUsers);
    app.post('/graphics/demography/comments/locations', usersDemography.getLocationCommentsUsers);
    app.post('/graphics/demography/comments/companys', usersDemography.getCompanyCommentsUsers);
    app.post('/graphics/demography/comments/jobs', usersDemography.getJobCommentsUsers);
}

module.exports = router;