import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';

export default function SearchScreen({ navigation }) {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  const [poem, setPoem] = useState(null)
  
  const fetchPoems = () => {
    fetch(`http://poetrydb.org/lines/${searchWord}`)
      .then(response => response.json())
      .then(responseData => {
        setPoems(responseData)
        // console.log(poems)
        // console.log(poems.length)
      })
      // .then(response => console.log(poems))
      .catch(error => console.error(error))
  }


  useEffect(() => {
    const index = Math.floor(Math.random() * poems.length + 1)
    console.log(poems[index]);
    
    // setPoem(poems[index])
  }, [poems])
    
  console.log(poem);
  
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
    </View>
  );
}