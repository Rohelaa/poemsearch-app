import React, { useState, useEffect } from "react"
import db from '../config'
import { View, Text } from "react-native"
import utility from '../utility'

export default function SonnetScreen() {
  const [sonnet, setSonnet] = useState('')

  console.log('sonnet:', sonnet)

  useEffect(() => {
    checkDb()
    // checkSonnetDate()
    // getSonnetFromDb()
    // fetchSonnet()
    // saveSonnetIntoDb()
  }, [])

  const deleteSonnetFromDb = () => {
    db.transaction(tx => {
      tx.executeSql('delete from sonnet', [], (_, { rows }) => {
        console.log(rows)
      })
    })
  }

  const checkSonnetDate = () => {
    if (sonnet.date.toString().substring(0, 15) !== new Date().toString().substring(0, 15)) {
      deleteSonnetFromDb()
      fetchSonnet()
      saveSonnetIntoDb()
    }
  }

  // tarkistaa, onko tietokanta tyhjä
  // jos on, hakee sonetin ja lisää sen sinne
  const checkDb = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], async (_, { rows }) => {
        if (rows._array.length === 0) {
          console.log('No sonnets in db')
          await fetchSonnet()
          saveSonnetIntoDb()
        } else {
          const sonnet = rows._array[0]

          if (sonnet.date.substring(0, 15) === new Date().toString().substring(0, 15)) {
            // console.log('qowkeoqwekKWQEOKOPQEWOKPQWEKOPEWQ')
            setSonnet(sonnet)
          } else {
            deleteSonnetFromDb()
            fetchSonnet()
            saveSonnetIntoDb()
          }
        }



        console.log(rows._array.length)
      })
    })
  }

  const getSonnetFromDb = () => {
    db.transaction(tx => {
      tx.executeSql('select * from sonnet', [], (_, { rows }) => {
        const sonnet = rows._array[0]
        
        console.log('date of the sonnet: ', sonnet.date.substring(0, 15))

        if (sonnet.date.substring(0, 15) === new Date().toString().substring(0, 15)) {
          console.log('TOIMIIIIIIIIIIIIIIIIIIIIIIIIIIII')
          setSonnet(sonnet)
        } else {
          console.log('Dates did not match')
          deleteSonnetFromDb()
          fetchSonnet()
        }
        
      })
    }, err => console.error(err))
  }

  const fetchSonnet = async () => {
    const response = await fetch('http://poetrydb.org/linecount/14')
    const data = await response.json()
    const randomSonnetWithDate = utility.addDateToObject(utility.getRandomObjectFromArray(data))
    console.log('There should be a date in this object: ', randomSonnetWithDate)

    setSonnet(randomSonnetWithDate)
  }

  const saveSonnetIntoDb = () => {
    db.transaction(tx => {
      tx.executeSql('insert into sonnet (title, author, lines, date) values (?, ?, ?, ?)',
       [
         sonnet.title,
         sonnet.author,
         utility.turnLinesArrayToString(sonnet.lines),
         sonnet.date.toString()
       ]
      )
    }, err => console.error(err))
  }

  // tietokannan tyhjennys

  // db.transaction(tx => {
  //   tx.executeSql('delete from sonnet', [], (_, { rows }) => {
  //     console.log(rows)
  //   })
  // })

  return (
    <View>
      <Text>{sonnet.title}</Text>
      <Text>{sonnet.author}</Text>
      <Text>{sonnet.lines}</Text>
    </View>
  )
}