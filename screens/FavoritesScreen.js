import db from '../config'
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import SwipableList from '../components/SwipableList'

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null)
  
  // päivittää suosikkinäkymän aina, kun näkymään navigoidaan
  useEffect(() => {
    navigation.addListener('focus', () => {
      getFavorites()
    })
  })

  const navigateToPoem = (item) => {
    navigation.navigate('Poem', {
      title: item.title,
      author: item.author,
      lines: item.lines
    })
  }

  // poistaa runon tietokannan taulukosta favorite
  // onnistunut poistaminen johtaa funktion getFavorites kutsuun, mikä
  // saa aikaan uudelleenrenderöinnin
  const deleteFromFavorites = (item_id) => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM favorite WHERE id='${item_id}'`)
    }, err => console.error(err), updateFavorites(item_id)
    )
  }

  // päivittää listanäkymän poiston jälkeen
  const updateFavorites = item_id => {
    setFavorites(favorites.filter(f => f.id !== item_id))
  }

  // näyttää konsolissa swaipatun osan propertyn 'key'
  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  // tekee kyselyn tietokantaan, jolla haetaan favorite-taulun sisältämät rivit
  const getFavorites = () => {
    db.transaction(tx => {
      tx.executeSql('select * from favorite', [], (_, { rows }) => {

        // riveillä oltava property 'key'
        // ...row on tässä, koska sen avulla saadaan muut runon tiedot favorites-tilaan
        setFavorites(rows._array.map((row, i) => ({ key: `${i}`, ...row })))
      }, err => console.error(err))
    })
  }
  
  return (
    <View style={styles.container}>
      <SwipableList 
        data={favorites}
        navigateToPoem={navigateToPoem}
        handleDelete={deleteFromFavorites}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  }
})