import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Icon, Card } from 'react-native-elements'
import db from '../config'

export default function PoemScreen({ route, navigation }) {
  const [poem, setPoem] = useState(route.params)
  const [favoriteTitles, setFavoriteTitles] = useState([])

  console.log(poem.lines)
  // luo tietokantaan taulun suosikeille
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists favorite
        (id integer primary key not null, title text, author text, lines text)`)
    }, null,
    )
  }, [])

  useEffect(() => {
    getFavorites()
  }, [])

  useLayoutEffect(() => {
    if (!(favoriteTitles.includes(poem.title))) {
      navigation.setOptions({
        headerRight: () => (
          <Icon 
            containerStyle={{
              right: 10
            }}
            name="favorite"
            onPress={addToFavorites}
          />
        )
      }) 
    }
    
  }, [navigation])

  // tietokannan tyhjennys

  // db.transaction(tx => {
  //   tx.executeSql('delete from favorite', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  const getFavorites = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM favorite', [], (_, rs) => {
        // talletetaan tilaan taulukko, jossa runojen nimet
        setFavoriteTitles(rs.rows._array.map(p => p.title))
      })
    }, err => console.error(err.message))
  }


  const addToFavorites = () => {
    db.transaction(tx => {
      tx.executeSql('insert into favorite (title, author, lines) values (?, ?, ?)',
        [
          poem.title,
          poem.author,
          poem.lines
        ]
      )
    },
    // errorin tullessa
    error => console.error(error),
    // onnistuessa lisätään tilaan lisätyn runon nimi ja näytetään ilmoitus
    () => {
      setFavoriteTitles(favoriteTitles.concat(poem.title))
      Alert.alert('Poem was added to favorites!')
    })
  }

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={{
        alignItems: 'center'
      }}
    >  
    {/* Jos runo löytyy jo suosikeista, renderöidään null eli ei mitään. Muuten renderöidään 
        suosikkipainike */}
      {
        favoriteTitles.includes(poem.title) ?
          null
          : <Icon 
              onPress={addToFavorites}
              name='favorite'
              size={30}
              iconStyle={{
                color: 'red'
              }}
            />
      }
      <Text style={{ fontSize: 20 }}>{poem.title}</Text>
      <Text>{poem.author}</Text>
      <Card>
        <Text>{poem.lines}</Text>
      </Card>
      <Text>{poem.date}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})