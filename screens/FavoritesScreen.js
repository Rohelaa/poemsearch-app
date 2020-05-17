import db from '../config'
import { ListItem, Icon } from 'react-native-elements'
import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import Poem from './PoemScreen'
import { useFocusEffect } from '@react-navigation/native'

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null)

  // useEffect(() => {
  //   getFavorites()
  // }, [])

  // päivittää suosikkinäkymän aina, kun näkymään navigoidaan
  useEffect(() => {
    navigation.addListener('focus', () => {
      getFavorites()
    })
  })

  // hook, joka aktivoituu aina näkymään siirtyessä
  // useCallBack-hook oltava myös
  // useFocusEffect(
  //   useCallback(() => getFavorites())
  // )

  // Parametrina data 
  // voisi olla myös { item }
  const renderItem_ = (data) => (
    <ListItem 
      title={data.item.title}
      subtitle={data.item.author}
      // onPress={() => navigation.navigate('Poem', {
      //   title: data.item.title,
      //   author: data.item.author,
      //   lines: data.item.lines,
      //   favorite: true
      // })} 
      chevron 
      bottomDivider 
    />
  )

  // Swaipattava osa
  const renderItem = ({ item }) => (
    <TouchableHighlight
      style={styles.rowFront}
      underlayColor={'#AAA'}
      onPress={() => navigation.navigate('Poem', {
        title: item.title,
        author: item.author,
        lines: item.lines,
        favorite: true
      })}
    >
      <View>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )

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

  // Swaippauksen paljastama sisältö
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity 
        style={
          [styles.backRightBtn, 
          styles.backRightBtnRight]
        }
        onPress={() => {
          deleteFromFavorites(data.item.id)
          console.log('item id: ', data.item.id)
        }}
      >
        <View>
          <Icon 
            name='delete'
            color='white'
          /> 
        </View>
      </TouchableOpacity>
    </View>
  )

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
      <SwipeListView 
        data={favorites}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  backTextWhite: {
      color: '#FFF',
  },
  rowFront: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
  },
});