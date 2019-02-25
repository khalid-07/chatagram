import React from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Button, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import db from '../db'
import firebase from 'firebase'
import functions from 'firebase/functions'
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chats',
  };
  //state items are refreshed when  it is re rendered
 state= {
     chats:[],
     Message:"",
     Username:"",
     imageEmail:null,
 }
 
 users = []
 Create = async () => {
    //console.log("clicked")
    //db.collection("Chat").add({Message:this.state.Message,Time:new Date(),Username: firebase.auth().currentUser.email})
    var addMessage = firebase.functions().httpsCallable('addMessage');
    const result = await addMessage({message: this.state.Message})
    this.setState({Message:"",Username:""})
  }
  changeImage = async ()=> {
    console.log("ckicked")
    await firebase.functions().httpsCallable('updateImage')();

  }
 componentDidMount(){
  db.collection("users").onSnapshot(querySnapshot=> {
    this.users = [];
    querySnapshot.forEach(doc=> {
      this.users.push({id: doc.id, ...doc.data()});
    });
        console.log("Current users: ", this.users.length);
    
});
    //go to db and get all the records.
    db.collection("Chat").orderBy("Time").onSnapshot(querySnapshot=> {
          let chatsarray = [];
          querySnapshot.forEach(doc=> {
            chatsarray.push({id: doc.id, ...doc.data()});
          });
          this.setState({chats:chatsarray})
          console.log("Current chats: ", chatsarray.join(", "));
          
      });

      db.collection("image").onSnapshot(querySnapshot=> {
        let images = [];
        querySnapshot.forEach(doc=> {
          images.push({id: doc.id, ...doc.data()});
        });
        this.setState({imageEmail: images[0].email})
            console.log("Current imageEmail: ", images[0].email);
        
    });   
  
  }
  avatarURL = (Username)=> {
    return "avatars%2F" + this.users.find(u => u.id === Username).avatar.replace("@","%40")
    //return "avatars%2F"+email.replace("@","%40")
  }

  imageURL = (Username)=> {
    return "images%2F" + Username.replace("@","%40")
    //return "avatars%2F"+email.replace("@","%40")
  }
  render() {
    return (
      <View style={styles.container}>
      {this.state.imageEmail &&
        <View>
        <Image
          style={{width: 400, height: 200}}
          source={{uri:`https://firebasestorage.googleapis.com/v0/b/khalid-project-221812.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=37d32828-5b8a-4d11-9bf5-9469751391f5`}}        
        />
         <Text>Caption: {this.users.find(u => u.id===this.state.imageEmail).caption}</Text>
        </View>
      }
      <Button
          title={'Change Image'}
          style={styles.input}
          onPress={this.changeImage}
        />
      <ScrollView >
      <View>
      <View style={{flex:1,flexDirection:"column"}}>
      
       {
            this.state.chats.map(chat =>
              <Text key={chat.id}>
                <Image
                  source={{uri:`https://firebasestorage.googleapis.com/v0/b/khalid-project-221812.appspot.com/o/${this.avatarURL(chat.Username)}?alt=media&token=62d93e08-4897-4347-8ea1-a0fe6a0770b4`}}
                  style={{width: 30, height: 30}}
                  borderRadius={15}
                  
                />
                <Text style={{fontWeight:"bold"}}>{" "}{this.users.find(u => u.id === chat.Username).name}{" : "}</Text>
                <Text>{chat.Message}{'\n'}</Text>
                
              </Text>)
          }
        </View>
        </View>
        </ScrollView>
        <View style={{flex:0,flexDirection:"row",justifyContent:"space-between",padding:5}}>
        <View>
        
        <TextInput
                    placeholder="Username"
                        value={firebase.auth().currentUser.email}
                    />
                    <TextInput
                    placeholder="Message"
                        onChangeText={Message => this.setState({ Message })}
                        value={this.state.Message}
                    />
                    </View>
                    <View>
                    <Button onPress={this.Create}  title="Send" style={{ width: 100, paddingTop: 20 }} />
                    </View>
        </View>
        </View>
     
  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
