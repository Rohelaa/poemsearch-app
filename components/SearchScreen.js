import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import * as SQLite from "expo-sqlite";
// import SonnetButton from './SonnetButton';

const db = SQLite.openDatabase('sonnetdb.db')
console.log(db)

export default function SearchScreen({ navigation }) {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  // // const [sonnets, setSonnets] = useState([])
  const [sonnet, setSonnet] = useState(null)
  
  const fetchPoems = () => {
    fetch(`http://poetrydb.org/lines/${searchWord}`)
      .then(response => response.json())
      .then(responseData => setPoems(responseData))
      .catch(error => console.error(error))
  }

  // palauttaa taulukosta satunnaisen olion
  const getRandomSonnet = (array) => {
    let randomSonnet = array[(Math.floor(Math.random() * array.length))]
    return randomSonnet
  }

  // metodi, joka lisää olioon pvm propertyn
  // käytännössä ihan toimiva
  const addDateToObject = (object) => {
    object.date = new Date()
  }

  // propertyn lisäämisen testausta...
  let testObject = { title: 'asd', author: 'asdasd'}

  addDateToObject(testObject)
  console.log(testObject);
  

  const fetchSonnet = () => {
    fetch('http://poetrydb.org/linecount/14')
      .then(res => res.json())
      .then(resData => {
      // console.log(typeof resData)
      // console.log('Sonnet of the day:', getRandomItem(resData))
        console.log('There should be a date here', addDateToObject(getRandomSonnet(resData)));
        
        setSonnet(getRandomSonnet(resData))
      })
  }

  const navigateToSonnetScreen = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_,{ rows }) => {
        console.log(rows._array)
        navigation.navigate('Poem', {
          title: rows._array[1].title,
          author: rows._array[1].author,
          lines: rows._array[1].lines
        })
      })
    })
  }

  // muuttaa säetaulukon yhdeksi merkkijonoksi
  const linesArrayToString = (array) => {
    let LinesString = ''
    array.forEach(line => {
      LinesString += line + '\n'
    })
    return LinesString
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
    }, null, navigateToSonnetScreen
    )
  }

  // luo tietokannan, jos sitä ei ole jo olemassa
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists sonnet 
        (id integer primary key not null, title text, author text, lines text, date text)`)
    })
  }, [])

  // nyt sonetti on joka kerta eri
  // useEffect(() => {
  //   if (sonnet !== null) {
  //     navigation.navigate('Poem', {
  //       title: sonnet.title,
  //       author: sonnet.author,
  //       lines: sonnet.lines,
  //     })
  //   }
  // }, [sonnet])

  // hakee sonetin ensimmäisen renderöinnin jälkeen
  useEffect(() => {
    fetchSonnet()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        keyExtractor={(item, index) => index.toString()}
        data={poems}
        renderItem={({ item }) => (
          <ListItem 
            onPress={() => navigation.navigate('Poem', {
              title: item.title,
              author: item.author,
              lines: item.lines,
            })}
            title={item.title}
            chevron
            bottomDivider />
        )} />
      <Input 
        onChangeText={text => setSearchWord(text)}
        value={searchWord} />  
      <Button 
        title='Search'
        onPress={fetchPoems} />  
      {/* <SonnetButton /> */}
      <Button 
        title='Sonnet of the day'
        onPress={saveItem} />
    </View>
  );
}