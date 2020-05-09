import React, { useState, useEffect } from 'react';
import { View, FlatList, Keyboard, SafeAreaView } from 'react-native';
import { Input, Button, ListItem, Header, Icon } from 'react-native-elements';
// import * as SQLite from "expo-sqlite";
// // import SonnetButton from './SonnetButton';
import database from "../db";
import utility from "../utility";
// import { Drawer } from "native-base";

const db = database.db
// console.log(db)

export default function HomeScreen({ navigation }) {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  const [sonnet, setSonnet] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

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
    db.transaction(async tx => {
      tx.executeSql('select * from sonnet', [], (_, { rows }) => {
        const sonnetInDb = rows._array[0]
        
        console.log('sonnets in database: ', rows.length)

        /* jos tietokanta on tyhjä, haetaan sonetti ja talletetaan
        komponentin tilaan */

        // if (rows._array.length === 0) {
        //   await fetchSonnet()
        //   console.log('current state (sonnet): ', sonnet)
        //   // saveSonnetToDb()
        // // muulloin haetaan sonetti ensin tietokannasta
        // } else {
        //   getSonnetFromDb()
        // }

        
        // getSonnetFromDb()


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
      // await fetchSonnet()
      // saveSonnetToDb()
      getSonnetFromDb()
    })
    // statessa ei oliota, sillä pukkaa erroria
    console.log('240923498080sd9f09sdfg809sdfg890', sonnet)
    // fetchSonnet()
  }, [])

  // tarkistaa yllä olevan effect-hookin hakeman sonetin päivän
  // useEffect(() => {
  //   if (sonnet.date !== new Date().getDate) {
  //     console.log('PÄIVÄT EIVÄT TÄSMÄÄ!!!!!!!!!!!!!!!!!!!!!')
  //   }
  // }, [sonnet])

  console.log('current sonnet: ', sonnet)

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


  // useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql('select * from sonnet', [], async (_, { rows }) => {
  //       const sonnetInDb = await rows._array[0]
        
  //       console.log('sonnets in database: ', rows)

  //       /* jos tietokanta on tyhjä, haetaan sonetti ja talletetaan
  //       komponentin tilaan */

  //       if (rows._array.length === 0) {
  //         await fetchSonnet()
  //         console.log('current state (sonnet): ', sonnet)
  //         // saveSonnetToDb()
  //       // muulloin haetaan sonetti ensin tietokannasta
  //       } else {
  //         getSonnetFromDb()
  //       }


  //       // 86 400 000 on millisekunttien määrä vuorokaudessa
  //       // ei välttämättä toimiva ratkaisu :DDDD
  //       // koska ei huomioi vuorokauden vaihtumista, mikä 
  //       // olisi ideana
        
  //       // ehto toteutuu, jos ero on suurempi kuin luku tai 
  //       // päivä ei täsmää ja ero on pienempi kuin luku
  //       // sitten haetaan uusi sonetti fetchSonnet-metodilla
        
  //       // console.log(today.getTime() - sonnetDateParsed.getTime())

  //       // if (sonnetInDb === undefined) {
  //       //   fetchSonnet()
  //       // }

  //       // if (86400000 <= today.getTime() - sonnetDateParsed.getTime() || 
  //       // (sonnetDateParsed.getDate() != today.getDate() && 
  //       // 86400000 > today.getTime() - sonnetDateParsed.getTime())) {
  //       //   fetchSonnet()
  //       // } else {
  //       //   console.log('PÖÖÖ!!')
  //       //   setSonnet(sonnetInDb)
  //       // }

  //     })
  //   })
  //   // statessa ei oliota, sillä pukkaa erroria
  //   console.log(sonnet.date)
  //   // fetchSonnet()
  // }, [])

  const getSonnetFromDb = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_, { rows }) => {
        const sonnet = rows._array[0]
        setSonnet(sonnet)
        console.log('sonnet currently in db: ', sonnet)
      })
    }, error => console.error(error))
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
    const data = await response.json()
    const randomSonnetWithDate = utility.addDateToObject(utility.getRandomObjectFromArray(data))
    console.log('There should be a date in this object: ', randomSonnetWithDate)

    setSonnet(randomSonnetWithDate)
  }
  
  // poikkeuksien hallinta puuttuu vielä, sama ylläolevassa metodissa
  const fetchPoems = async () => {
    try {
      const response = await fetch(`http://poetrydb.org/lines/${searchWord}`)
      const data = await response.json()
      console.log(data.status)

      // jos haku ei löydä mitään, palautuu vastauksena olio jonka status kentän arvo on 404
      if (data.status === 404) {
        setErrorMsg(data.reason)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000);
      } else {
        setPoems(data)
        // piilottaa näppäimistön 
        Keyboard.dismiss()
      }

    } catch (exception) {
      setErrorMsg('Input not valid')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  // hakee tietokannasta sonetin tiedot ja siirtyy 'Poem' näkymään 
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
          utility.turnLinesArrayToString(sonnet.lines),
          sonnet.date.toString()
        ]
      )
    }, error => console.error(error))
  }

  const menuButton = () => (
    <Icon 
      name='menu'
      onPress={() => navigation.openDrawer()}
    />
  )

  return (
    <View style={{ flex: 1 }}>
      <Header 
        placement="left"
        leftComponent={menuButton} />
      <View style={{ alignItems: 'center'}}>
        <Input 
          onChangeText={text => setSearchWord(text)}
          value={searchWord} 
          errorMessage={errorMsg}/>  
        <Button 
          containerStyle={{ 
            marginTop: 10,
            width: 100
          }}
          title='Search'
          onPress={fetchPoems} />
      </View>
      <FlatList 
        style={{ marginTop: 10 }}
        keyExtractor={(item, index) => index.toString()}
        data={poems}
        renderItem={({ item }) => (
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
      <Button 
        title='Sonnet of the day'
        onPress={saveItem} />
      <Button 
        title='Favorites'
        onPress={() => navigation.navigate('Favorites')} />
    </View>
  );
}