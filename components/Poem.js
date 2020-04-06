import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'

export default function Poem(props) {
  // console.log(poems);
  
  const [poem, setPoem] = useState(null)

  useEffect(() => {
    const index = Math.floor(Math.random() * (poems.length + 1))
    setPoem(poems)
  }, [])


  return (
    poem.map(line => {
      <Text>line</Text>
    })
  )
}