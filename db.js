import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('sonnetdb.db')

export default { db }