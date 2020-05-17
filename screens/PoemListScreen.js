import React, { useEffect, useState } from "react"
import { View, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import util from '../utility'

export default function PoemListScreen({ route, navigation }) {
  const author = route.params.author
  
  const [poems, setPoems] = useState([])

  useEffect(() => {
    getPoems()
  }, [])

  async function getPoems() {
    const response = await fetch(`http://poetrydb.org/author/${author}`)
    const formattedData = await response.json()
    
    setPoems(formattedData)
  }

  return (
    <View>
      <FlatList 
        keyExtractor={(item, index) => index.toString()}
        // taulukko järjestetty title-propertyn mukaan aakkosjärjestykseen
        data={util.sortPoemsByTitle(poems)}
        renderItem={({ item }) => (
          <ListItem 
            title={item.title}
            onPress={() => {
              navigation.navigate('Poem', {
                title: item.title,
                author: item.author,
                lines: util.turnLinesArrayToString(item.lines)
              })
            }}
          />
        )}
      />
    </View>
  )
}