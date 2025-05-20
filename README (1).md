
# 📦 Progetto API Serie A – 

## ✅ Descrizione
Questa API consente di visualizzare informazioni sul campionato di Serie A, tra cui:
- Le 10 partite di una specifica giornata
- La ricerca dei giocatori tramite nome e cognome
- Classifica punti, marcatori e assistman
- Testa a testa delle prossime partite
- Risultati e eventi delle partite giocate
- Le rose delle squadre 

Il progetto è sviluppato con:
- **Node.js + Express** (server API)
- **Sequelize** (ORM)
- **Axios** (per eventuali chiamate HTTP)
- **MySQL** (come database relazionale)

---

## 🧱 Requisiti

### Software richiesto:
- **Node.js** (versione >= 16 consigliata)
- **MySQL** installato in locale

---

## ⚙️ Installazione
 
### 1. importa il database in un dbms

### 2. scarica il progetto

```bash
cd nome-cartella-progetto
```

### 3. Installa le dipendenze
```bash
npm install
```

### 4. Avvia il server
```bash
node src/app.js
```

---

## 🌐 Endpoint principali

### 🔹 Visualizza partite di una giornata
`GET /api/giornata/30`

**Esempio:**  
`GET http://localhost:8080/giornata/30`

---

### 🔹 Cerca un giocatore
`GET /api/giocatore?nome=marcus&cognome=thuram`

**Esempio:**  
`GET http://localhost:8080/api/giocatore?nome=marcus&cognome=thuram`

---

## 📁 Struttura del progetto

```
├── models/             # Modelli Sequelize
├── controllers/        # Logica degli endpoint
├── routes/             # Definizione delle rotte
├── config/             # Configurazione Sequelize
├── .env                # Configurazione ambiente
├── app.js              # Entrypoint principale
├── package.json
└── README.md
```

---

## 🧪 Test rapido
Dopo l’avvio, puoi testare l’API con Postman o dal browser con i due endpoint elencati sopra.

