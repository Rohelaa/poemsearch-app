import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from './screens/HomeScreen';
import Poem from "./screens/PoemScreen";
import FavoritesScreen from './screens/FavoritesScreen';
import SonnetScreen from './screens/SonnetScreen';
import { Icon } from 'react-native-elements';
import BrowseScreen from './screens/BrowseScreen';
import PoemListScreen from './screens/PoemListScreen';

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
              onPress={() => navigation.toggleDrawer()}
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
              onPress={() => navigation.toggleDrawer()}
            />
          )
        }} />
      <Stack.Screen name="Poem" component={Poem} />
    </Stack.Navigator>
  )

  const BrowseStack = ({ navigation }) => (
    <Stack.Navigator>
      <Stack.Screen 
        name="Browse"
        component={BrowseScreen}
        options={{
          headerLeft: () => (
            <Icon 
              name="menu"
              onPress={() => navigation.toggleDrawer()}
            />
          )
        }}
      />
      <Stack.Screen 
        name="PoemList"
        component={PoemListScreen}
      />
    </Stack.Navigator>
  )
  
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" children={HomeStack} />
        <Drawer.Screen name="Sonnet" component={SonnetScreen} />
        <Drawer.Screen name="Favorites" children={FavoritesStack} />
        <Drawer.Screen name="Browse" children={BrowseStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}