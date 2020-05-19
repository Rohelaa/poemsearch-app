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
const SearchFilter = React.forwardRef(({ handleSearchFilterChange, searchFilter }, ref) => {
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
            <RadioForm>
              {
                radio_props.map((obj, i) => (
                  <RadioButton key={i}>
                    <RadioButtonInput 
                      isSelected={searchFilter === obj.value}
                      obj={obj}
                      index={i}
                      onPress={handleSearchFilterChange}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={handleSearchFilterChange}
                    />
                  </RadioButton>
                ))
              }
            </RadioForm>
          </View>
          : null
      }
    </View>
  )
})

export default SearchFilter