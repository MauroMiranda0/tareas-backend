const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Base de datos SQLite
const db = new sqlite3.Database('tareas.db')

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT,
    completada INTEGER
  )
`)

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
    db.all('SELECT * FROM tareas', (err, filas) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(filas)
    })
})

// Crear una tarea
app.post('/tareas', (req, res) => {
    const { texto } = req.body
    db.run('INSERT INTO tareas (texto, completada) VALUES (?, 0)', [texto], function(err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ id: this.lastID, texto, completada: 0 })
    })
})

// Cambiar estado completada
app.put('/tareas/:id', (req, res) => {
    const { completada } = req.body
    const id = req.params.id
    db.run('UPDATE tareas SET completada = ? WHERE id = ?', [completada ? 1 : 0, id], function(err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ success: true })
    })
})

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
    const id = req.params.id
    db.run('DELETE FROM tareas WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ success: true })
    })
})

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('API de tareas funcionando ✅')
})