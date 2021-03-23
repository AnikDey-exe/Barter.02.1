import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyTradesScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allTrades : [],
       donorName: "",
     }
     this.requestRef= null
   }

   getDonorDetails=(userId)=>{
    db.collection("Users").where("emailID","==", userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          "donorName" : doc.data().firstName + " " + doc.data().lastName
        })
      });
    })
  }


   getallTrades =()=>{
    this.requestRef = db.collection("AllTrades").where("traderID" ,'==', this.state.userId)
    .onSnapshot((snapshot)=>{
      //var allDonations = snapshot.docs.map(document => document.data());
      var allTrades = [];
       snapshot.docs.map((doc) => {
         var trade = doc.data();
         trade['doc_id'] = doc.id;
         allTrades.push(trade);
       });
      this.setState({
        allTrades : allTrades,
      });
    })
   }

   sendItem = (itemDetails) => {
    if(itemDetails.requestStatus === "Item Send") {
        var requestStatus = "Trader Interested";
        db.collection("AllTrades").doc(itemDetails.doc_id).update({
            'requestStatus': "Trader Interested"
        })
        this.sendNotification(itemDetails, requestStatus)
    }
    else {
        var requestStatus = "Item Send";
        db.collection("AllTrades").doc(itemDetails.doc_id).update({
            'requestStatus': "Item Send"
        })
        this.sendNotification(itemDetails, requestStatus)
    }
}

sendNotification = (itemDetails, requestStatus) => {
   var requestID = itemDetails.requestID;
   var donorID = itemDetails.donorID;

   db.collection("AllNotifications")
   .where("requestId", "==", "requestId")
   .where("donorId", "==", "donorId")
   .get()
   .then((snapshot) => {
    snapshot.forEach((doc) => {
      var message = ""
      if(requestStatus === "Item Send"){
        message = this.state.donorName + " sent you the item."
      }else{
         message =  this.state.donorName  + " has shown interest in trading the item."
      }
      db.collection("AllNotifications").doc(doc.id).update({
        "message": message,
        "notificationStatus" : "unread",
        "date"                : firebase.firestore.FieldValue.serverTimestamp()
      })
    });
   })
}


   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.itemName}
       subtitle={"Requested By : " + item.requestedBy +"\nStatus : " + item.requestStatus}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
        <TouchableOpacity
        style={[
        styles.button,
        {
            backgroundColor : item.requestStatus === "Item Send" ? "green" : "#ff5722"
        }
        ]}
        onPress = {()=>{
            this.sendItem(item)
        }}
    >
        <Text style={{color:'#ffff'}}>
        {
            item.requestStatus === "Item Send" ? "Item Send" : "Send Item"
        }
        </Text>
   </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getallTrades();
     this.getDonorDetails(this.state.userId);
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Trades"/>
         <View style={{flex:1}}>
           {
             this.state.allTrades.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List Of All Trades </Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allTrades}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})