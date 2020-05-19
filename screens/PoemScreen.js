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
      tx.executeSql(`CREATE TABLE IF NOT EXIST favorite
        (id integer primary key not null, title text, author text, lines text)`)
    }, null,
    )
  }, [])

  useEffect(() => {
    getFavorites()
  }, [])

  // vaikuttaa toimivan
  // hook saa aikaan sydän-ikonin valikkopalkkiin
  // pitäisi näkyä vain silloin, jos runo ei löydy suosikeista
  // hyödynnetään navigationin setOptions proppia
  useLayoutEffect(() => {
    if (!favoriteTitles.includes(poem.title)) {
      navigation.setOptions({
        headerRight: () => (
          <Icon 
            color="red"
            containerStyle={{
              right: 10
            }}
            name="favorite"
            onPress={addToFavorites}
          />
        )
      }) 
    } else {
      navigation.setOptions({
        headerRight: () => {
          null
        }
      })
    }
  })

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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{
        alignItems: 'center'
      }}
    >  
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