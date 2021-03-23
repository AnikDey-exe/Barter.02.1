import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class HomeScreen extends Component {

    constructor(){
        super()
        this.state = {
          addedItemsList : []
        }
        this.requestRef = null
    }

    getAddedItemsList =()=>{
        this.requestRef = db.collection('ItemsList')
        .onSnapshot((snapshot)=>{
          var addedItemsList = snapshot.docs.map(document => document.data());
          this.setState({
            addedItemsList : addedItemsList
          });
        })
    }
    
    componentDidMount(){
        this.getAddedItemsList();
    }
    
    componentWillUnmount(){
        this.requestRef();
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ( {item, i} ) =>{
      return (
        <ListItem
          key={i}
          title={item.itemName}
          subtitle={item.itemDescription}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          rightElement={
            <TouchableOpacity 
            style={styles.button}
            onPress={()=>{this.props.navigation.navigate("ReceiverDetails",{"details": item})}}>
              <Text style={{color:'black'}}> View </Text>
            </TouchableOpacity>
          }
        bottomDivider
        />
      )
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <MyHeader
                title="Home"
                navigation={this.props.navigation}/>
                
                <View style={{flex:1}}>
                {
                this.state.addedItemsList.length === 0
                ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Items Added</Text>
              </View>
                )
                :(
                <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.addedItemsList}
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
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"white",
      shadowColor: "#000",
      marginTop: 50,
      marginLeft: 40,
      shadowOffset: {
         width: 0,
         height: 8
       }
    },
  })