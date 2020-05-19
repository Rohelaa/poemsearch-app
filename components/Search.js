import React, { useState } from "react"
import { View, Keyboard } from "react-native"
import { Input, Button } from "react-native-elements"
import SearchFilter from "./SearchFilter"

export default function Search({ setPoems, setShowActivityIndicator, showActivityIndicator }) {
  const [searchWord, setSearchWord] = useState('')
  const [searchFilter, setSearchFilter] = useState('title')
  // näkyy, jos hakusanalla ei löydy tuloksia tai hakukenttä jää tyhjäksi
  const [errorMsg, setErrorMsg] = useState(null)
 
  // luodaan ref (viite?)
  // tämän avulla päästään käsiksi toisen komponentin funktioihin
  // tässä tapauksessa SearchFilter-komponentin 
  const searchRef = React.createRef()

  const fetchPoems = async () => {
    try {
      // asetetaan lataus-kuvake aktiiviseksi
      console.log(searchWord)
      console.log(searchFilter)
      setShowActivityIndicator(true)
      searchRef.current.hideFilters()
      const response = await fetch(`http://poetrydb.org/${searchFilter}/${searchWord}`)
      const data = await response.json()
     
      // jos haku ei löydä mitään, palautuu vastauksena olio jonka status kentän arvo on 404
      if (data.status === 404) {
        setErrorMsg(data.reason)
        setSearchFilter('title')
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
    // piilottaa lataus-animaation
    setShowActivityIndicator(false)
  }

  return (
    <View>
      <View style={{ alignItems: 'center'}}>
        <Input 
          placeholder={
            searchFilter === 'lines' ? 
              'Search by keyword' 
              : `Search by ${searchFilter}`
          }
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
          {/* muuttuja searchRef toimii viitteenä */}
        <SearchFilter 
          searchFilter={searchFilter}
          ref={searchRef}
          handleSearchFilterChange={(value) => setSearchFilter(value)} 
          showActivityIndicator={showActivityIndicator}
        />
      </View>
    </View>
  )
}