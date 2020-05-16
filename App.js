import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from './screens/HomeScreen';
import Poem from "./screens/Poem";
import FavoritesScreen from './screens/FavoritesScreen';
import SonnetScreen from './screens/SonnetScreen';
import { Icon } from 'react-native-elements';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function App() {

  // Mahdollistaa siirtymisen listauksesta Poem-näkymään 
  // Syötetään Dwawer.Screeniin children propsina
  const HomeStack = ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        // menu ikoni headerin vasemmassa reunassa
        options={{
          headerLeft: () => (
            <Icon 
              name='menu' 
              onPress={() => navigation.openDrawer()}
            />
          )
        }} />
      <Stack.Screen name="Poem" component={Poem} />
    </Stack.Navigator>
  ) 

  // Stack-navigaatio Favorites-näkymälle
  const FavoritesStack = ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerLeft: () => (
            <Icon 
              name="menu"
              onPress={() => navigation.openDrawer()}
            />
          )
        }} />
      <Stack.Screen name="Poem" component={Poem} />
    </Stack.Navigator>
  )
  
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" children={HomeStack} />
        <Drawer.Screen name="Sonnet" component={SonnetScreen} />
        <Drawer.Screen name="Favorites" children={FavoritesStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}