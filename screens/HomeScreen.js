import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import { Input, Button, ListItem, Header, Icon } from 'react-native-elements';
import db from "../config";
import utility from "../utility";
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  const [sonnet, setSonnet] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [showActivityIndicator, setShowActivityIndicator] = useState(false)

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
    }, err => console.error(err))
  }, [])

  // luo tietokantaan taulun suosikeille
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists favorite
        (id integer primary key not null, title text, author text, lines text)`)
    }, err => console.error(err))
  }, [])

  // kuuntelija, joka reagoi näkymän aktivoitumiseen 
  // kun käyttäjä joko palaa näkymään tai navigoi siihen sivuvalikon avulla
  // poistetaan aiemmin kirjoitettu hakusana ja sillä löytyneet runot
  // useEffect(() => {
  //   navigation.addListener('focus', () => {
  //     setSearchWord('')
  //     setPoems([])
  //   }) 
  // })

  // useFocusEffect(
  //   useCallback(() => {
      
  //   })
  // )

  const getSonnetFromDb = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_, { rows }) => {
        const sonnet = rows._array[0]
        setSonnet(sonnet)
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

  // const fetchSonnet = async () => {
  //   const response = await fetch('http://poetrydb.org/linecount/14')
  //   const data = await response.json()
  //   const randomSonnetWithDate = utility.addDateToObject(utility.getRandomObjectFromArray(data))
  //   console.log('There should be a date in this object: ', randomSonnetWithDate)

  //   setSonnet(randomSonnetWithDate)
  // }
  
  const fetchPoems = async () => {
    try {
      console.log('searching with word: ', searchWord)
      // asetetaan lataus-kuvake aktiiviseksi
      setShowActivityIndicator(true)
      const response = await fetch(`http://poetrydb.org/lines/${searchWord}`)
      const data = await response.json()
     

      // jos haku ei löydä mitään, palautuu vastauksena olio jonka status kentän arvo on 404
      if (data.status === 404) {
        setShowActivityIndicator(false)
        setErrorMsg(data.reason)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000);
      } else {
        setPoems(data)
        // tilan päivityksen jälkeen lataus-kuvake piilotetaan
        setShowActivityIndicator(false)
        // piilottaa näppäimistön 
        Keyboard.dismiss()
      }
    } catch (exception) {
      setErrorMsg('Input not valid')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
    // en ole varma, onko pakollinen..
    setShowActivityIndicator(false)
  }

  // hakee tietokannasta sonetin tiedot ja siirtyy 'Poem' näkymään 
  const navigateToSonnetScreen = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_,{ rows }) => {
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

  // const saveItem = () => {
  //   db.transaction(tx => {
  //     // tx.executeSql('delete from sonnet')
  //     tx.executeSql('insert into sonnet (title, author, lines, date) values (?, ?, ?, ?)',
  //       [
  //         sonnet.title, 
  //         sonnet.author, 
  //         sonnet.lines,
  //         sonnet.date.toString()
  //       ]
  //     )
  //   }, (error) => console.log(error), navigateToSonnetScreen)
  // }

  // const saveSonnetToDb = () => {
  //   db.transaction(tx => {
  //     tx.executeSql('insert into sonnet (title, author, lines, date) values (?, ?, ?, ?)',
  //       [
  //         sonnet.title, 
  //         sonnet.author, 
  //         utility.turnLinesArrayToString(sonnet.lines),
  //         sonnet.date.toString()
  //       ]
  //     )
  //   }, error => console.error(error))
  // }
  
  return (
    <View style={{ flex: 1 }}>
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
      {/* Näyttää lataus kuvakkeen sen aikaa, kun tietoa noudetaan */}
      {
        showActivityIndicator ?
          <ActivityIndicator size='large' />
          : <FlatList 
              style={{ marginTop: 10 }}
              keyExtractor={(item, index) => index.toString()}
              data={poems}
              renderItem={({ item }) => (
                <ListItem 
                  onPress={() => navigation.navigate('Poem', {
                    title: item.title,
                    author: item.author,
                    lines: item.lines
                  })}
                  title={item.title}
                  chevron
                  bottomDivider
                />
              )} 
            />
      }
    </View>
  );
}