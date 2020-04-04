import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';

export default function App() {
  const [searchWord, setSearchWord] = useState('')
  const [poems, setPoems] = useState([])
  const [poem, setPoem] = useState('')
  
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
    console.log(Math.floor(Math.random() * poems.length + 1))
  }, [poems])

  return (
    <View style={styles.container}>
      <Input 
        onChangeText={text => setSearchWord(text)}
        value={searchWord} />  
      <Button 
        title='Search'
        onPress={fetchPoems} />    
      <Text>{poem}</Text>
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
