import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'

export default function Poem({ route }) {
  console.log(route.params)
  
  const [poem, setPoem] = useState(route.params)

  return (
    <View>
      <Text>{poem.title}</Text>
      <Text>{poem.author}</Text>
      {poem.lines.map(line => (
        <Text>{line}</Text>
      ))}
    </View>
      
    
  )
}