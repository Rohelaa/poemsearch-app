import { Icon } from "react-native-elements";
import React, { useState } from 'react'
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

export default function SearchFilter({
  handleSearchFilterChange
}) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <View>
      <Icon
        onPress={() => setShowFilters(!showFilters)} 
        name='tune'
      />
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
}