import React, { useState, useEffect } from 'react'
import { ScrollView, FlatList, View } from 'react-native'
import database from '../db'
import { ListItem } from 'react-native-elements'

const db = database.db

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState(null)

  useEffect(() => {
    getFavorites()
  }, [])

  const getFavorites = () => {
    db.transaction(tx => {
      tx.executeSql('select * from favorite', [], (_, { rows }) => {
        setFavorites(rows._array)
      }, err => console.error(err))
    })
  }

  return (
    <View>
      <FlatList 
        data={favorites}
        renderItem={({ item }) => {
          console.log(item)
          return (
            <ListItem 
              title={item.title}
              subtitle={item.author}
              onPress={() => navigation.navigate('Poem', {
                title: item.title,
                author: item.author,
                lines: item.lines,
                favorite: true
              })} 
              chevron 
              bottomDivider />
          )
        }} />
    </View>
  )
}