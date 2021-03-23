import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component {
    constructor() {
        super();
        this.state ={
          userId : firebase.auth().currentUser.email,
          itemName:"",
          itemDescription:"",
          itemStatus: '',
          requestedItemName: '',
          isItemRequestActive: null,
          docId: '',
          userDocId: ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    receiveItems=(itemName)=>{
      var userId = this.state.userId
      var requestId = this.state.requestId
      db.collection('ReceivedItems').add({
          "userId": userId,
          "itemName":itemName,
          "requestId"  : requestId,
          "itemStatus"  : "received",
    
      })
    }

    getitemRequest = () => {
      var itemReq = db.collection("ItemsList").where("emailID","==",this.state.userId).get()
      .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            if(doc.data().itemStatus !== "received") {
              this.setState({
                requestId: doc.data().requestId,
                requestedItemName: doc.data().itemName,
                itemStatus: doc.data().itemStatus,
                docId: doc.id
              })
            }
          })
      })
    }

    sendNotification=()=>{
      //to get the first name and last name
      db.collection('Users').where('emailID','==',this.state.userId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var name = doc.data().firstname
          var lastName = doc.data().surname
    
          // to get the donor id and item nam
          db.collection('AllNotifications').where('requestId','==',this.state.requestId).get()
          .then((snapshot)=>{
            snapshot.forEach((doc) => {
              var donorId  = doc.data().donorId
              var itemName =  doc.data().itemName
    
              //targert user id is the donor id to send notification to the user
              db.collection('AllNotifications').add({
                "targetedUserId" : donorId,
                "message" : name +" " + lastName + " received the item " + itemName ,
                "notificationStatus" : "unread",
                "itemName" : itemName
              })
            })
          })
        })
      })
    }
    
        getItemRequestIsActive = () => {
          db.collection("Users").where("emailID","==",this.state.userId)
          .onSnapshot(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
              this.setState({
                isItemRequestActive: doc.data().isItemRequestActive,
                userDocId: doc.id
              })
            })
          })
        }
    
    addItem =async(itemName, itemDescription)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('ItemsList').add({
            "userId": userId,
            "itemName":itemName,
            "itemDescription":itemDescription,
            "requestId":randomRequestId,
            "itemStatus": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp()
        })
    
        this.setState({
            itemName:'',
            itemDescription: ''
        })

        await this.getitemRequest();

        db.collection("Users").where("emailID","==",userId).get()
        .then().then((snapshot)=>{
          snapshot.forEach((doc)=>{
            db.collection("Users").doc(doc.id).update({
              isItemRequestActive: true
            })
          })
        })
    }

    componentDidMount() {
      this.getitemRequest()
      this.getitemRequestIsActive()
    }

    
updateitemRequestStatus=()=>{
  //updating the item status after receiving the item
  db.collection('RequestedItems').doc(this.state.docId)
  .update({
    itemStatus : 'received'
  })

  //getting the  doc id to update the users doc
  db.collection('Users').where('emailID','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('Users').doc(doc.id).update({
        isitemRequestActive: false
      })
    })
  })
}


    render() {
      if(this.state.isItemRequestActive === true){
        return(
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{borderColor: 'orange',borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
               <Text> item Name </Text>
               <Text> {this.state.requestedItemName} </Text>
            </View>
            <View style={{borderColor: 'orange',borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
               <Text> item Status </Text>
               <Text> {this.state.itemStatus}</Text>
            </View>
            <TouchableOpacity style={{borderWidth: 1, borderColor: 'orange', justifyContent: 'center', backgroundColor: 'orange', width: 300, height: 30, marginTop: 30, alignItems: 'center', alignSelf: 'center'}}
            onPress={()=>{
              this.sendNotification()
              this.updateItemRequestStatus()
              this.receiveItems(this.state.requestedItemName)
            }}>
               <Text>
                   I Received The item
               </Text>
            </TouchableOpacity>
          </View>
        )     
     }
     else {
        return(
            <View style={{flex: 1}}>
                <MyHeader
                title="Exchange Items"
                navigation={this.props.navigation}/>
                  <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"Item"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"About The Item"}
                onChangeText ={(text)=>{
                    this.setState({
                        itemDescription: text
                    })
                }}
                value ={this.state.itemDescription}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addItem(this.state.itemName,this.state.itemDescription)}}
                >
                <Text>Add</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
            </View>
        )
    }
  }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )