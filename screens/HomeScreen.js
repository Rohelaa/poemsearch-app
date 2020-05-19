import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import db from "../config";
import utility from "../utility";
import Search from '../components/Search';

export default function HomeScreen({ navigation }) {
  const [poems, setPoems] = useState([])
  const [showActivityIndicator, setShowActivityIndicator] = useState(false)

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

  // tietokannan taulun poistaminen

  // db.transaction(tx => {
  //   tx.executeSql('drop table favorite', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })
  
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