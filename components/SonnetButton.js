import React, { useEffect, useState } from "react"
import { Button } from "react-native-elements"
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('sonnetdb.db')
console.log(db)

export default function SonnetButton({ navigation }) {
  const [sonnet, setSonnet] = useState(null)

  // fetchaus SearchScreenissä ja sonetti propsina tänne ??
  useEffect(() => {
    fetchSonnet()
  }, [])

  const fetchSonnet = () => {
    fetch('http://poetrydb.org/linecount/14')
      .then(res => res.json())
      .then(resData => {
      // console.log(typeof resData)
      // console.log('Sonnet of the day:', getRandomItem(resData))
        setSonnet(getRandomItem(resData))
      })
  }

  const navigateToSonnetScreen = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_,{ rows }) => {
        console.log(rows._array)
        navigation.navigate('Poem', {
          title: rows._array[13].title,
          author: rows._array[13].author,
          lines: rows._array[13].lines
        })
      })
    })
  }

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into sonnet (title, author, lines) values (?, ?, ?)',
        [
          sonnet.title, 
          sonnet.author, 
          linesArrayToString(sonnet.lines)
        ]
      )
    }, null, navigateToSonnetScreen)
  }
  
  return (
    <Button 
        title='Sonnet of the day'
        onPress={saveItem} />
  )
}