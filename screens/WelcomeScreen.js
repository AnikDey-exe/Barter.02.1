import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView, Image, Modal, ScrollView} from 'react-native';
import db from '../config';
import firebase from 'firebase';


export default class WelcomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
        emailID: '',
        password: '',
        isModalVisible: false,
        firstName: '',
        lastName: '',
        address: '',
        contact: '',
        confirmPassword: ''
    }   
  }

  userSignUp = (emailID,password,confirmPassword) => {
    if(password !== confirmPassword) {
        return Alert.alert("Password does not match. \n Check your password.")
    }  
    else {
        firebase.auth().createUserWithEmailAndPassword(emailID, password)
        .then(()=>{
          db.collection("Users").add({
              'firstName': this.state.firstName,
              'lastName': this.state.lastName,
              'contact': this.state.contact,
              'emailID': this.state.emailID,
              'address': this.state.address,
              'isItemRequestActive': false
          })
          return Alert.alert("User added successfully.",
          [{text: 'OK', onPress: () => this.setState({
              isModalVisible: false
          })}]);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  }

  userLogin = (emailID,password) => {
    firebase.auth().signInWithEmailAndPassword(emailID,password)
    .then(()=>{
        this.props.navigation.navigate('ExchangeItem');
    })
    .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
    })
  }

  showModal = () => {
    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}> 
          <View style={styles.modalContainer}>
              <ScrollView style={{width: '100%'}}>
                  <KeyboardAvoidingView style={styles.KeyboardAvoidingView} behavior="padding" enabled>
                  <Text style={styles.modalTitle}> Registration </Text>
                  <TextInput
                  style={styles.formTextInput}
                  placeholder="First Name"
                  maxLength={8}
                  onChangeText={(text)=>{
                      this.setState({
                          firstName: text
                      })
                  }}/>

                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Last Name"
                  maxLength={8}
                  onChangeText={(text)=>{
                      this.setState({
                          lastName: text
                      })
                  }}/>

                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Contact"
                  maxLength={10}
                  keyboardType={'numeric'}
                  onChangeText={(text)=>{
                      this.setState({
                          contact: text
                      })
                  }}/>

                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Address"
                  multiline={true}
                  onChangeText={(text)=>{
                      this.setState({
                          address: text
                      })
                  }}/>

                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Email"
                  keyboardType={'email-address'}
                  onChangeText={(text)=>{
                      this.setState({
                          emailID: text
                      })
                  }}/>
                  
                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(text)=>{
                      this.setState({
                          password: text
                      })
                  }}/>
                  
                  <TextInput
                  style={styles.formTextInput}
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  onChangeText={(text)=>{
                      this.setState({
                          confirmPassword: text
                      })
                  }}/>

                  <View style={styles.modalBackButton}>
                      <TouchableOpacity 
                      style={styles.registerButton}
                      onPress={()=>{
                          this.userSignUp(this.state.emailID, this.state.password, this.state.confirmPassword)
                      }}>
                          <Text style={styles.registerButtonText}> Register </Text>
                      </TouchableOpacity>
                  </View>

                  <View style={styles.modalBackButton}>
                      <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={()=>this.setState({
                          isModalVisible: false
                      })}>
                          <Text style={{color: '#ff5722'}}> Cancel </Text>
                      </TouchableOpacity>
                  </View>
                  </KeyboardAvoidingView>
              </ScrollView>
          </View>

        </Modal>
    )
}

  render(){
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
           <View style={{justifyContent: 'center', alignItems: 'center'}}>
        </View>
          {this.showModal()}
          <View>
            <Image
            source={require('../assets/barter.png')}
            style={{width: 200, height: 200, alignItems: 'center',marginTop: 30}}/>
            <Text style={styles.title}> Barter </Text>
          </View>
          <View>
              <TextInput
              style={styles.loginBox}
              placeholder="Email"
              placeholderTextColor="#eb4634"
              keyboardType='email-address'
              onChangeText={(text)=>{
                  this.setState({
                      emailID: text
                  })
              }}/>

              <TextInput
              style={styles.loginBox}
              placeholder="Password"
              placeholderTextColor="#eb4634"
              secureTextEntry={true}
              onChangeText={(text)=>{
                this.setState({
                    password: text
                })
              }}/>
          </View>

          <View>
              <TouchableOpacity 
              style={styles.loginButton}
              onPress={()=>{this.userLogin(this.state.emailID,this.state.password)}}> 
                  <Text style={styles.loginText}> Login </Text>
              </TouchableOpacity>

              <TouchableOpacity 
              style={styles.loginButton}
              onPress={()=>{this.setState({
                isModalVisible: true
              })}}> 
                  <Text style={styles.loginText}> Sign Up </Text>
              </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffab19',
      alignItems: 'center',
    },
    title: {
        fontSize: 55,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: '300',
        paddingBottom: 0,
        color: '#ff2819',
        //fontFamily: 'lato-bold'
    },
    loginBox: {
        width: 300,
        height: 50,
        borderBottomWidth: 2,
        borderColor: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        margin: 20,
        paddingLeft: 0,
        paddingBottom: 30
    },
    loginButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        margin: 15,
        width: 300,
        height: 50,
        justifyContent: 'center'
    },
    loginText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#1952ff',
        fontWeight: 'bold'
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginRight: 30,
        marginLeft: 30,
        marginTop: 80,
        marginBottom: 80
      },
      KeyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalTitle: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
        color: '#ff5722',
        margin: 50
      },
      formTextInput: {
        width: '75%',
        height: '5%',
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10
      },
      modalBackButton: {
          
      },
      registerButton: {
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 30
      },
      cancelButton:{
        width: 200,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
      },
      registerButtonText: {
        color: '#ff5722',
        fontSize: 15,
        fontWeight: 'bold' 
      }
  });
