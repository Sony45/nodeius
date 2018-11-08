
const TelegramBot = require('node-telegram-bot-api');
const token = '522499792:AAF8dtcYntNFyWMKft1x4--AJ0HJwt-nrUU';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');
const weather = require('weather-js');
 
// bienvenida al grupo
bot.onText(/\/link/, (msg) => {
   bot.exportChatInviteLink(msg.chat.id).then(invite_link => {
     bot.sendMessage(msg.chat.id, invite_link);
      });
 });

bot.on('message', function(msg){
   
  	var chatId = msg.chat.id;
	var chatitle = msg.chat.title;
  
    if (msg.new_chat_members != undefined){
    
        var nameNewMember = msg.new_chat_member.first_name;
    
        bot.sendMessage(chatId, "Hola" + nameNewMember + " bienvenido al grupo" + chatitle+ "escribe /empezar para conocer los comandos de este Agente");
    }
    else if (msg.left_chat_members != undefined){
    
        var nameLeftMember = msg.left_chat_member.first_name;
        
        bot.sendMessage(chatId, " te extrañare" + nameLeftMember);
    }
});

// saludar cuando diga hola
 bot.on('message', (msg) => {
 var Hola = "hola";
 if (msg.text.toString().toLowerCase().indexOf(Hola) === 0) {
     bot.sendMessage(msg.chat.id, "Hola  " + msg.from.first_name + "  que podemos hacer para ayudarte ✌️? Att. (IUS)");
 }
 });
// expulsar cuando escriba idiota
 bot.on('message', (msg) => {
 var what = "idiota";
 if (msg.text.includes(what)) {
 bot.kickChatMember(msg.chat.id,msg.from.id);
 bot.unbanChatMember(msg.chat.id,msg.from.id);
 }
 });
// bienvenida al grupo
 bot.onText(/\/empezar/, (msg) => {
bot.sendMessage(msg.chat.id, "/ban: para eliminar a un usuario. manteniendo presionado un mensaje del usuario especifico + numero que sera la cantidad de dias a eliminar"  + "\n /promover: convertir usuario a administrador. manteniendo presionado un mensaje del usuario especifico" +  "\n /clima + pais: da el clima. " + "\n /link: obtiene el link de invitacion de grupo" +  "\n  " + " \n /opp  al contactar al bot directamenta  te da tu ubicacion y tu numero de telefono ");    
 });
// genera el ID
 bot.onText(/chatid/, (msg) => {
const chatId = msg.chat.id;
bot.sendMessage(chatId, "El id de este chat es: " + chatId);
});
// genera el ID personal
bot.onText(/\/myid/, (msg) => {
 const chatId = msg.chat.id;
 const myId = msg.from.id;
 bot.sendMessage(chatId, "Tu id es: " + myId);  
 });

// enfia foto de una url
 bot.onText(/\/foto/, (msg) => {
 bot.sendPhoto(msg.chat.id,"https://www.google.com.gt/search?q=frases+motivacionales&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj26J28zvfdAhVQhOAKHTRVDpYQ_AUIDigB&biw=1366&bih=657#imgrc=rFLE9dR8LxuSwM:" ); 
 });
// envia audio en formato ogg
 bot.onText(/\/audio/, (msg) => {
  bot.sendAudio(msg.chat.id,"https://archive.org/download/soy-lisa/soy-lisa.ogg",{caption : "Soy un archivo ogg "} );  
 });
// envia audio en formato mp3
   bot.onText(/\/mp3/, (msg) => {
  bot.sendAudio(msg.chat.id,"https://archive.org/download/soy-lisa/soy-lisa.mp3",{caption : "Soy un archivo mp3 "} );  
 });
// da la direccion de sierto punto geografico estatico
 bot.on('message', (msg) => {
     var localizacion = "lugar";
     if (msg.text.indexOf(localizacion) === 0) {
         bot.sendLocation(msg.chat.id,14.667177,-90.850551);
     }
 });

// da la localizacion ()
bot.onText(/opp/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{text: 'localizacion', request_location: true}],
        [{text: 'contacto #Phone', request_contact: true}],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),

  };
  bot.sendMessage(msg.chat.id, 'Selecciona una de las opciones', opts);
});

bot.on('localizacion', (msg) => {
  console.log(msg.location.latitude);
  console.log(msg.location.longitude);
});

// da el clima de sierto lugar
bot.onText(/^\/clima (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var ciudad = match[1];

    var opciones = {
        search: ciudad, // lugar es la ciudad que el usuario introduce
        degreeType: 'C', // Celsius
        lang: 'es-ES' // Lenguaje en el que devolverá los datos
    }

    weather.find(opciones, function(err, result){

        if (err){ // Si ocurre algun error...
            console.log(err); // ... nos lo muestra en pantalla

        } else {
            console.log(result[0]); // Visualizamos el primer resultado del array
            
            bot.sendMessage(chatId, "Lugar: " + result[0].location.name +
            "\n\nTemperatura: " + result[0].current.temperature + "ºC\n" +
            "Visibilidad: " + result[0].current.skytext + "\n" +
            "Humedad: " + result[0].current.humidity + "%\n" +
            "Dirección del viento: " + result[0].current.winddisplay + "\n"
            ,{parse_mode: 'Markdown'});

        }
    })
});

// banea a sierto usuario
bot.onText(/^\/ban (.+)/, function(msg, match){

    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    var text = match[1];
    const ms = require("ms");

    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, userId).then(function(data){
        if((data.status == 'creator') || (data.status == 'administrator')){
        bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + ms(text + " days"))/1000)}).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido baneado durante " + text + " días.")
            })
        }
        else {
        bot.sendMessage(chatId, "Lo siento " + fromName + ", no eres administrador")
        }
    })
});

// quita la funcion banear
bot.onText(/^\/unban/, function(msg){
    
    var chatId = msg.chat.id;
    var replyId = msg.reply_to_message.from.id;
    var userId = msg.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    
   if(msg.reply_to_message == undefined){
   return;
   }
   
  bot.getChatMember(chatId, userId).then(function(data){
       if((data.status == 'creator') || (data.status == 'administrator')){
            bot.unbanChatMember(chatId, replyId).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido desbaneado");
            })
        }
        else {
            bot.sendMessage(chatId, "Lo siento " + fromName + ", no eres administrador");
        }
    })
});

// promueve a admin 
bot.onText(/^\/promover/, function(msg){

// Fijamos las variables
    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var userName = msg.from.first_name;
    var messageId = msg.message_id;
//

// Fijamos las propiedades con su respectivo valor
    const prop = {};
    
    prop.can_delete_message = true;
    prop.can_change_info = false;
    prop.can_invite_users = true;
    prop.can_pin_messages = true;
    prop.can_restrict_members = true;
    prop.can_promote_members = false;
// 

    if (msg.reply_to_message == undefined){
        return;
        }

    bot.getChatMember(chatId, userId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.promoteChatMember(chatId, replyId, prop).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "Ahora " + replyName + ", es administrador.")
        })
    }
else {
    bot.sendMessage(chatId, "Lo siento " + userName + ", no eres administrador" )
        }
    })
});

//  regresa a usuario normal
bot.onText(/^\/user/, function(msg) {

    var chatId = msg.chat.id;
    var replyName = msg.reply_to_message.from.first_name;
    var replyId = msg.reply_to_message.from.id;
    var userId = msg.from.id;
    var fromName = msg.from.first_name;
    var messageId = msg.message_id;
    const prop = {};
    
    prop.can_change_info = false;
    prop.can_delete_message = false;
    prop.can_invite_users = false;
    prop.can_pin_messages = false;
    prop.can_restrict_members = false;
    prop.can_promote_members = false;
// 

    if (msg.reply_to_message == undefined) {
        return;
    }

    bot.getChatMember(chatId, userId).then(function(data) {
        if ((data.status == 'creator') || (data.status == 'administrator')) {
            bot.promoteChatMember(chatId, replyId, prop).then(function(result) {
                bot.deleteMessage(chatId, messageId)
                bot.sendMessage(chatId, "Ahora " + replyName + ", ya no es administrador.")
            })
        } 
        else {
            bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador.")
        }
    })
});

// da informe del tipo de chat
bot.onText(/^\/chat/, function(msg){
    var chatId = msg.chat.id;
    var chatType = msg.chat.type;

    if (chatType == 'private'){
        
        bot.sendMessage(chatId, "este chat esta en privado")
    }

    else if (chatType == 'supergroup'){
        
        bot.sendMessage(chatId, "este chat es un supergrupo");
    }

    else if (chatType == 'group'){
       
        bot.sendMessage(chatId, "este chat es un grupo normal")
    }

    else if (chatType == 'channel'){
        // No hago nada
        return;
    }
});


