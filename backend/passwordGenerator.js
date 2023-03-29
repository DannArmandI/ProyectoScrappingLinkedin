passw = {}


passw.generatePassword = ()=>{

    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let tamPass = Math.floor(Math.random()*8)+9
    let password = ""
    let numbers = 3;
    let letters = tamPass - numbers;
    let contadorNum = 0
    let contadorStr = 0
    while(password.length<tamPass){

        let indice = Math.floor(Math.random()*chars.length)

        if(!isNaN(chars[indice]) && contadorNum<numbers){
            password+= chars[indice]
            contadorNum++
        }else if(isNaN(chars[indice]) && contadorStr<letters){
            password+= chars[indice]
            contadorStr++
        }
    }
    console.log(password)
    return password
}




module.exports = passw