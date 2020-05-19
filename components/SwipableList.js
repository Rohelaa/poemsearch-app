import { SwipeListView } from 'react-native-swipe-list-view'
import { TouchableHighlight, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import React from 'react'

export default function SwipableList({ data, navigateToPoem, handleDelete }) {

  // Swaipattava osa
  const renderItem = ({ item }) => (
    <TouchableHighlight
      style={styles.rowFront}
      underlayColor={'#AAA'}
      onPress={() => navigateToPoem(item)}
    >
      <View>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )

  // Swaippauksen paljastama sisältö
  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <View>
          <Icon 
            name="delete"
            color="white"
          />
        </View>
      </TouchableOpacity>
    </View>
  )
  return (
    <View>
      <SwipeListView 
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-75}
        previewOpenDelay={3000}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
})