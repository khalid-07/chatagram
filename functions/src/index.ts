import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch'
admin.initializeApp(functions.config().firebase)
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const writeMessage = functions.firestore
    .document('Chat/{id}')
    .onWrite((change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const message = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const oldMessage = change.before.data();
        console.log("message = ",message)
        console.log("old messsage = ",oldMessage)
        // perform desired operations ...
    });

    export const onWriteUsers = functions.firestore
    .document('users/{id}')
    .onWrite(async(change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const user = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const oldUser = change.before.data();
        console.log("message = ",user)
        console.log("old messsage = ",oldUser)
        // perform desired operations ...

        ///choices: user logged in, user logged out, user registered. 
        let message = null
        if(!oldUser|| user.online&&!oldUser.online)
        {
            message = "Hi"
        }
        else if (oldUser.online && !user.online)
        {
            message = "Bye"
        }
        if(message){
            await admin.firestore().collection("Chat").add({Username:"Bot.png",Message:message+" "+user.name+"! ",Time:new Date()})
        }
    });



 export const addMessage = functions.https.onCall(async(data, context) => {
    const message = data.message
    const email = context.auth!.token.email || null;
    const help =["Type !hi to chat with Bot\n","Type !users to see all the users\n"]
    console.log("Success!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //await admin.firestore().collection("Chat").add({Username:email,Message:message,Time:new Date()})
    await admin.firestore().collection("Chat").add({Username:email,Message:message,Time:new Date()})
    //if message == !hi, say 'Hi' to the user
    if(message==="!hi")
    {
         await admin.firestore().collection("Chat").add({Username:"Bot.png",Message:"Hi to "+email,Time:new Date()})
    }
    else if(message=="!users"){
         const querySnapshot = await admin.firestore().collection("Chat").get()
         const users = new Array()

        querySnapshot.forEach(doc=> {
            const username = doc.data().Username
            
            if(!users.includes(username))
            users.push(username);
          });
          await admin.firestore().collection("Chat").add({Username:"Bot.png",Message:users,Time:new Date()})
    }
    else if(message=="!help"){
        await admin.firestore().collection("Chat").add({Username:"Bot.png",Message:help,Time:new Date()})
    }
    else if (message=="!weather"){
        const city = message.slice(9)
        console.log(city)
        const json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},qatar&appid=33d91fb0631c2173f8cd9a2433ea24b9`)
        const description = json.weather[0].main
        const temp = json.main.temp - 273
        const message2="Currently "+description+" and temp is "+temp+" in "+city
        //https://api.openweathermap.org/data/2.5/weather?q=doha,qatar&appid=33d91fb0631c2173f8cd9a2433ea24b9

        await admin.firestore().collection("Chat").add({Username:"Bot.png",Message:message2,Time:new Date()})
    }
    
    return null
    //console.log("Success!!!")

    //response.send("Hello from Firebase!");
});
export const updateImage = functions.https.onRequest(async (req,res)=>{
    // find all images (users with captions)
    //const querySnapshot = await admin.firestore().collection("Chat").get()
    //find the users with caption greater than empty string(find the users with captions)
    const querySnapshot = await admin.firestore().collection("users").where("caption",">","").get()
    
    const emails = new Array()
    querySnapshot.forEach(doc=> {
        //const caption = doc.data().caption
        emails.push(doc.id)
    })
    console.log("emails ",emails)
    //pick one at random
        const email = emails[Math.floor(emails.length * Math.random())]

    //change user document in image collection
    await admin.firestore().collection('image').doc("user").update({email:email})
    res.status(200).send();
    
});

