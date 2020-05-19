import { Icon } from "react-native-elements";
import React, { useState, useImperativeHandle } from 'react'
import { View } from "react-native";
import RadioForm, { 
  RadioButton, 
  RadioButtonInput,
  RadioButtonLabel
 } from 'react-native-simple-radio-button'

const radio_props = [
  { label: 'Title', value: 'title' },
  { label: 'Keyword', value: 'lines' },
  { label: 'Author', value: 'author' }
]

// funktio kääritty funktiokutsun forwardRef sisälle
// tällä tavoin komponentti pääsee käsiksi sille määritettyyn refiin
const SearchFilter = React.forwardRef(({ handleSearchFilterChange }, ref) => {
  const [showFilters, setShowFilters] = useState(false)

  const hideFilters = () => {
    setShowFilters(false)
  }

  // hookin avulla komponentin funktioita pystytään kutsua tämän ulkopuolella muissa komponenteissa
  useImperativeHandle(ref, () => {
    return {
      hideFilters
    }
  })

  return (
    <View>
      <Icon
        onPress={() => setShowFilters(!showFilters)} 
        name="tune"
      />
      {/* Ehdollinen renderöinti. Määrittää näkyvätkö haun suodatusasetukset */}
      {
        showFilters ?
          <View>
            <RadioForm 
              radio_props={radio_props}
              initial={0}
              onPress={handleSearchFilterChange}
            />
          </View>
          : null
      }
    </View>
  )
})

export default SearchFilter