import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList } from 'react-native';
// import { Input, Button, ListItem } from 'react-native-elements';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from './components/HomeScreen';
import Poem from "./components/Poem";
import Favorites from './components/Favorites';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Poem" component={Poem} />
        <Drawer.Screen name="Favorites" component={Favorites} />
      </Drawer.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Poem" component={Poem} />
    //     <Stack.Screen name="Favorites" component={Favorites} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  )
}

// export default function App(
  
// )
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

