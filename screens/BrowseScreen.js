import React, { useState, useEffect } from 'react'
import { ListItem } from 'react-native-elements'
import { View, FlatList } from 'react-native'

export default function BrowseScreen({ navigation }) {
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    getAllAuthors()
  }, [])
  
  const getAllAuthors = async () => {
    try {
      const response = await fetch('http://poetrydb.org/author')
      const data = await response.json()

      setAuthors(data.authors)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View>
      <FlatList 
        data={authors}
        renderItem={({ item }) => (
          <ListItem 
            title={item}
            onPress={() => navigation.navigate('PoemList', {
              author: item
            })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}