import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default function Poem({ route }) {
  console.log(route.params)
  
  const [poem, setPoem] = useState(route.params)


  const reducer = (accumulator, currentValue, currentIndex) => {
    // console.log(accumulator)
    return (
      accumulator + currentValue
    )
  }
    
  
  // const lines = poem.lines.reduce(reducer)
  // console.log(lines)


  /** ehdollinen renderöinti, koska sonetin säkeet ovat taulukon sijaan merkkijonona */
  if (typeof poem.lines === "string") {
    return (
    <ScrollView>
      <Text style={{ fontSize: 20 }}>{poem.title}</Text>
      <Text>{poem.author}</Text>
      <Text>{poem.lines}</Text>
    </ScrollView>
    )
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 20, textAlign: "center" }}>{poem.title}</Text>
      <Text style={{ textAlign: "center" }}>{poem.author}</Text>
      <View style={{ marginLeft: 5 }}>
        {poem.lines.map(line => (
          <Text>{line}</Text>
        ))}
      </View>
      
      {/* {lines} */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
})