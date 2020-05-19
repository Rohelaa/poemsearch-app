import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('poemdb.db')

export default db 