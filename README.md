# todo-backend

```bash
        .
      ":"
    ___:____     |"\/"|
  ,'        `.    \  /
  |  O        \___/  |
~^~^~^~^~^~^~^~^~^~^~^~^~
```
Lõbus vaalake, mis teeb teile kõik töö ära.


## Jooksuta api

```bash
    npm start
```

## Todo

1. CRUD API endpointid User ja Taskidele
    - [x] User
        - [x] GET
        - [x] POST
        - [x] PUT
        - [x] DELETE
    - [0] Task
        - [0] GET
        - [0] POST
        - [0] PUT
        - [0] DELETE
2. Peale igat muutumist salvesta faili.
3. login süsteem.
    - iga kord kui kasutaja lehele tuleb kontrollime kas tal on olemas auth token.
        - kui on login voi reg leht siis ei kontrolli kas oled sisse logitud.
        - muul juhul tahame leida mis kasutajale auth™ token kuulub (express middleware) ((https://expressjs.com/en/guide/using-middleware.html))
        - panen user objecti kuhugi muutujasse kirja nii et seda saaks kontrolleris kasutada
        - Token 
            - on random string mida on raske järgi teha
            - on pikk nt 64 tähemärki
            - alphanumetrical URLi kaudu saatmiseks
            - Crypto library nt bcrypt
        - loginis teeme uue sessiooni (sessioon seob random tokeni useriga) useragent,ip,createdat salvetame sessiooni andmebaasi

    ### Login Todo
    - login, otsime ules kasutajanime ja parooli
    - session expire - max 30 paeva
    - konto loomine
    - leiad useri ja koik taskid mis kuuluvad sellele userile
    - filtreerid koik taskid ja vaatad mis kuuluvad userile
    - password encryption
    
4. Asenda json failid andmebaasiga.