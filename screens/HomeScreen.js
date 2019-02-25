import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Alert
} from 'react-native';
import { WebBrowser } from 'expo';
import firebase from 'firebase'
import db from '../db.js'
import { ImagePicker } from 'expo';
import {uploadImageAsync} from '../imageUtils'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    Username :"",
    Password : "",
    name:"",
    avatar:null,
    caption:"",
    image:null

  }
handleClick = ()=>
{
  console.warn("yess");
}
pickAvatar = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });

  console.log(result);

  if (!result.cancelled) {
    this.setState({ avatar: result.uri });
    console.log("urikkkk",result.uri)
  }
};
pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });

  console.log(result);

  if (!result.cancelled) {
    await uploadImageAsync("images",result.uri,this.state.Username)
    await db.collection('users').doc(this.state.Username).update({caption:this.state.caption})
  }
};


loginorRegister= async ()=>
{
  let avatar = "default.jpg"
  try {
    await firebase.auth().createUserWithEmailAndPassword(this.state.Username, this.state.Password)
    
    //upload this.state.image called this.state.email
    
    if(this.state.avatar){
      avatar = this.state.Username 
      await uploadImageAsync("avatars",this.state.avatar,this.state.Username)
      console.log("Upload result: ",avatar)
    }
    console.log("image upload: ",avatar)
    const name = this.state.name || this.state.Username
    await db.collection('users').doc(this.state.Username).set({name, avatar, online:true})
  }
  catch (error)
  {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode)
    console.log(errorMessage)
    if(errorCode == "auth/email-already-in-use")
    {
      try {
        await firebase.auth().signInWithEmailAndPassword(this.state.Username, this.state.Password)
        

        if(this.state.avatar){
          avatar = this.state.Username 
          await uploadImageAsync("avatars",this.state.avatar,this.state.Username)
          await db.collection('users').doc(this.state.Username).update({avatar})
        }
        await db.collection("users").doc(this.state.Username).update({online:true})


        if(this.state.name){
          await db.collection('users').doc(this.state.Username).update({name:this.state.name})
        }
        Alert.alert('Login Successfull!')
        //upload this.state.image called this.state.email
        //const result = this.state.image && await uploadImageAsync(this.state.image,this.state.name)
        //console.log("image upload: ",result)
      }catch (error)
      {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
      }
    }
  };
}

  render() {
    return (
      <View style={styles.container}>
     {this.state.avatar && <Image 
          style={{width:35,height:45}}
          source ={{uri:this.state.avatar}}
          />
     }
     
      <TextInput
          autoCapitalize="none"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          placeholder={'name'}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          value={this.state.Username}
          onChangeText={(Username) => this.setState({ Username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          value={this.state.Password}
          onChangeText={(Password) => this.setState({ Password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <Button
          title={'Login/Register'}
          style={styles.input}
          onPress={this.loginorRegister}
        />
        <Button
          title={'Select Avatar'}
          style={styles.input}
          onPress={this.pickAvatar}
          
        />

        
        <TextInput
          autoCapitalize="none"
          value={this.state.caption}
          onChangeText={(caption) => this.setState({ caption })}
          placeholder={'Caption'}
          style={styles.input}
        />
        {this.state.image && <Image 
          style={{width:35,height:45}}
          source ={{uri:this.state.image}}
          />
     }
        <Button
          title={'Upload New Image'}
          style={styles.input}
          onPress={this.pickImage}
          
        />
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
