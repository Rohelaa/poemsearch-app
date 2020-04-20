import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
// import * as SQLite from "expo-sqlite";
// // import SonnetButton from './SonnetButton';
import database from "../db";
import utility from "../utility";

const db = database.db
// console.log(db)



export default function SearchScreen({ navigation }) {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  const [sonnet, setSonnet] = useState(null)

  
  // luo tietokantaan taulun soneteille, jos sitä ei ole jo olemassa
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists sonnet 
        (id integer primary key not null, title text, author text, lines text, date text)`)
    })
  }, [])

  // luo tietokantaan taulun suosikeille
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists favorite
        (id integer primary key not null, title text, author text, lines text)`)
    }, null, () => console.log(db))
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
  /* tarkoitus olisi, että tämä hook hakisi uuden sonetin, jos komponentin
  tilassa olevan sonetin pvm olisi menneisyydessä */

  /* sovelluksen käynnistyessä tarkastetaan tietokannasta, onko siellä talletuksia, ja jos on, tarkastetaan
  sinne talletetun sonetin pvm. Jos pvm on jo mennyt, haetaan uusi sonetti, poistetaan "vanhentunut" sonetti ja 
  talletetaan juuri haettu sonetti tietokantaan. */


  useEffect(() => {
    
    const today = new Date()
    console.log(today.getTime())
    // if (sonnet.date.getDate() < date.getDate()) {
    //   console.log()
    // }
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], async (_, { rows }) => {
        // console.log('90842348902384', rows)

        const sonnetInDb = rows._array[0]
        // const sonnetDateParsed = new Date(sonnetInDb.date)
        // console.log(sonnetDateParsed.getTime())
         console.log(rows)
        // console.log(sonnetInDb)

        /* jos tietokanta on tyhjä, haetaan sonetti ja talletetaan
        komponentin tilaan */
        if (rows._array.length === 0) {
          await fetchSonnet()
        // muulloin haetaan sonetti ensin tietokannasta
        } else {
          getSonnetFromDb()
        }


        // 86 400 000 on millisekunttien määrä vuorokaudessa
        // ei välttämättä toimiva ratkaisu :DDDD
        // koska ei huomioi vuorokauden vaihtumista, mikä 
        // olisi ideana
        
        // ehto toteutuu, jos ero on suurempi kuin luku tai 
        // päivä ei täsmää ja ero on pienempi kuin luku
        // sitten haetaan uusi sonetti fetchSonnet-metodilla
        
        // console.log(today.getTime() - sonnetDateParsed.getTime())

        // if (sonnetInDb === undefined) {
        //   fetchSonnet()
        // }

        // if (86400000 <= today.getTime() - sonnetDateParsed.getTime() || 
        // (sonnetDateParsed.getDate() != today.getDate() && 
        // 86400000 > today.getTime() - sonnetDateParsed.getTime())) {
        //   fetchSonnet()
        // } else {
        //   console.log('PÖÖÖ!!')
        //   setSonnet(sonnetInDb)
        // }

      })
    })
    // console.log(sonnet.date)
    // fetchSonnet()
  }, [])

  const getSonnetFromDb = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_, { rows }) => {
        const sonnet = rows._array[0]
        setSonnet(sonnet)
        console.log('sonnet currently in db: ', sonnet)
      })
    }, error => console.error(error))
    // console.log(sonnet)
  }

  // tietokannan tyhjennys

  // db.transaction(tx => {
  //   tx.executeSql('delete from sonnet', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  // tietokannan taulun poistaminen

  // db.transaction(tx => {
  //   tx.executeSql('drop table sonnet', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  // tietokannan taulun poistaminen

  // db.transaction(tx => {
  //   tx.executeSql('drop table favorite', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  const fetchSonnet = async () => {
    const response = await fetch('http://poetrydb.org/linecount/14')
    // myös tässä oltava await
    const data = await response.json()
    const randomSonnetWithDate = addDateToObject(getRandomSonnet(data))
    console.log('There should be a date in this object', randomSonnetWithDate)

    setSonnet(randomSonnetWithDate)
  }
  
  const fetchPoems = () => {
    fetch(`http://poetrydb.org/lines/${searchWord}`)
      .then(response => response.json())
      .then(responseData => setPoems(responseData))
      .catch(error => console.error(error))
  }

  // palauttaa taulukosta satunnaisen olion
  const getRandomSonnet = (array) => {
    const randomIndex = (Math.floor(Math.random() * array.length))
    let randomSonnet = array[randomIndex]
    return randomSonnet
  }

  // metodi, joka lisää olioon pvm propertyn
  // käytännössä ihan toimiva
  const addDateToObject = (object) => {
    const objectWithDate = object
    objectWithDate.date = new Date()
    return objectWithDate
  }

  // propertyn lisäämisen testausta...
  let testObject = { title: 'asd', author: 'asdasd' }

  // addDateToObject(testObject)
  // console.log(testObject);

  const navigateToSonnetScreen = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_,{ rows }) => {
        // console.log('sonnets currently in db: ', rows._array)
        navigation.navigate('Poem', {
          title: rows._array[0].title,
          author: rows._array[0].author,
          lines: rows._array[0].lines,
          date: rows._array[0].date
        })
      })
    })
  }

  // muuttaa säetaulukon yhdeksi merkkijonoksi
  // const linesArrayToString = (array) => {
  //   let LinesString = ''
  //   array.forEach(line => {
  //     LinesString += line + '\n'
  //   })
  //   return LinesString
  // }

  /* poistaa tietokannassa olevan sonetin ja korvaa sen toisella
  nyt tekee edellämainitun, vaikka poistoa ei tarvitsisi tehdä */
  const saveItem = () => {
    db.transaction(tx => {
      // tx.executeSql('delete from sonnet')
      tx.executeSql('insert into sonnet (title, author, lines, date) values (?, ?, ?, ?)',
        [
          sonnet.title, 
          sonnet.author, 
          sonnet.lines,
          sonnet.date.toString()
        ]
      )
    }, (error) => console.log(error), navigateToSonnetScreen)
  }

  const saveSonnetToDb = () => {
    db.transaction(tx => {
      tx.executeSql('insert into sonnet (title, author, lines, date) values (?, ?, ?, ?)',
        [
          sonnet.title, 
          sonnet.author, 
          linesArrayToString(sonnet.lines),
          sonnet.date.toString()
        ]
      )
    }, error => console.error(error))
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        keyExtractor={(item, index) => index.toString()}
        data={poems}
        renderItem={({ item }) => (
          // Muuttaa apumetodilla lines-taulukon merkkijonoksi
          <ListItem 
            onPress={() => navigation.navigate('Poem', {
              title: item.title,
              author: item.author,
              lines: utility.turnLinesArrayToString(item.lines)
            })}
            title={item.title}
            chevron
            bottomDivider />
        )} />

        {/* validointi lisättävä. Tyhjä syöte laukaisee nyt errorin  */}
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
      <Button 
        title='Favorites'
        onPress={() => navigation.navigate('Favorites')} />
    </View>
  );
}