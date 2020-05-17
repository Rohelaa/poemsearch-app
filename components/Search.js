import React, { useState } from "react"
import { View, Keyboard } from "react-native"
import { Input, Button } from "react-native-elements"
import SearchFilter from "./SearchFilter"

export default function Search({
  setPoems,
  setShowActivityIndicator
}) {

  console.log(setShowActivityIndicator);
  
  const [searchWord, setSearchWord] = useState('')
  const [searchFilter, setSearchFilter] = useState('title')
  const [errorMsg, setErrorMsg] = useState(null)
  
  const fetchPoems = async () => {
    try {
      console.log('searching with word: ', searchWord)
      console.log('seaching with filter: ', searchFilter);
      
      // asetetaan lataus-kuvake aktiiviseksi
      setShowActivityIndicator(true)
      const response = await fetch(`http://poetrydb.org/${searchFilter}/${searchWord}`)
      const data = await response.json()
     
      // jos haku ei löydä mitään, palautuu vastauksena olio jonka status kentän arvo on 404
      if (data.status === 404) {
        setErrorMsg(data.reason)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
        setPoems([])
      } else {
        setPoems(data)
        // tilan päivityksen jälkeen lataus-kuvake piilotetaan
        // piilottaa näppäimistön 
        Keyboard.dismiss()
      }
    } catch (exception) {
      setErrorMsg('Input not valid')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
    // en ole varma, onko pakollinen..
    setShowActivityIndicator(false)
  }

  return (
    <View>
      <View style={{ alignItems: 'center'}}>
        <Input 
          onChangeText={text => setSearchWord(text)}
          value={searchWord} 
          errorMessage={errorMsg}/>  
        <Button 
          containerStyle={{ 
            marginTop: 10,
            width: 100
          }}
          title='Search'
          onPress={fetchPoems} />
        <SearchFilter 
          handleSearchFilterChange={(value) => setSearchFilter(value)} 
        />
      </View>
    </View>
  )
}