import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import db from "../config";
import utility from "../utility";
import Search from '../components/Search';

export default function HomeScreen({ navigation }) {
  const [poems, setPoems] = useState([])
  const [sonnet, setSonnet] = useState(null)
  const [showActivityIndicator, setShowActivityIndicator] = useState(false)

  // luo tietokantaan taulun soneteille, jos sitä ei ole jo olemassa
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXIST sonnet 
        (id integer primary key not null, title text, author text, lines text, date text)`)
    })
  }, [])

  // luo tietokantaan taulun suosikeille
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS favorite
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
  
  // hakee tietokannasta sonetin tiedot ja siirtyy 'Poem' näkymään 
  // const navigateToSonnetScreen = () => {
  //   db.transaction(tx => {
  //     tx.executeSql('select * from sonnet', [], (_,{ rows }) => {
  //       navigation.navigate('Poem', {
  //         title: rows._array[0].title,
  //         author: rows._array[0].author,
  //         lines: rows._array[0].lines,
  //         date: rows._array[0].date
  //       })
  //     })
  //   })
  // }

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
      <Search
        setPoems={setPoems}
        setShowActivityIndicator={setShowActivityIndicator}
        showActivityIndicator={showActivityIndicator}
      />
      {/* Näyttää lataus kuvakkeen sen aikaa, kun tietoa noudetaan */}
      {
        showActivityIndicator ?
          <ActivityIndicator size='large' />
          : <View>
              {/* <Text>Results: {poems.length}</Text> */}
              <FlatList 
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
                data={utility.sortPoemsByTitle(poems)}
                renderItem={({ item }) => (
                  <ListItem 
                    onPress={() => navigation.navigate('Poem', {
                      title: item.title,
                      author: item.author,
                      lines: utility.turnLinesArrayToString(item.lines)
                    })}
                    title={item.title}
                    chevron
                    bottomDivider
                  />
                )} 
              />
            </View>
      }
    </View>
  );
}