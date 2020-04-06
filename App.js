import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Poem from './components/Poem'

export default function App() {
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
    <View style={styles.container}>
      <FlatList 
        data={poems}
        renderItem={({ item }) => (
          <Text>{item.title}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
