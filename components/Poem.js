import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import database from '../db'
import utility from '../utility'

const db = database.db

export default function Poem({ route }) {
  console.log(route.params)
  
  const [poem, setPoem] = useState(route.params)

  // luo tietokantaan taulun suosikeille
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists favorite
        (id integer primary key not null, title text, author text, lines text)`)
    }, null, () => console.log(db))
  }, [])

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('select * from favorite', [], (_, { rows }) => {
        console.log(rows)
      })
    }, err => console.error(err))
  }, [])

  // tietokannan tyhjennys

  // db.transaction(tx => {
  //   tx.executeSql('delete from favorite', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  const reducer = (accumulator, currentValue, currentIndex) => {
    // console.log(accumulator)
    return (
      accumulator + currentValue
    )
  }

  const addToFavorites = () => {
    db.transaction(tx => {
      tx.executeSql('insert into favorite (title, author, lines) values (?, ?, ?)',
        [
          poem.title,
          poem.author,
          utility.turnLinesArrayToString(poem.lines)
        ],
        (_, { rows }) => console.log(rows))
    }, error => console.error(error))
  }
    
  
  // const lines = poem.lines.reduce(reducer)
  // console.log(lines)


  return (
    <ScrollView>
      <Text style={{ fontSize: 20 }}>{poem.title}</Text>
      <Text>{poem.author}</Text>
      <Text>{poem.lines}</Text>
      <Text>{poem.date}</Text>
      {poem.hasOwnProperty('favorite') ? 
        null
        : <Button 
            title='Add to favorites'
            onPress={addToFavorites} />}
      
    </ScrollView>
  ) 
}

const styles = StyleSheet.create({
})