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

[x] CRUD API endpointid User ja Taskidele
    - [x] User
        - [x] GET
        - [x] POST
        - [x] PUT
        - [x] DELETE
    - [x] Task
        - [x] GET
        - [x] POST
        - [x] PUT
        - [x] DELETE
[x] Peale igat muutumist salvesta faili.
[x] login süsteem.
    [x] iga kord kui kasutaja lehele tuleb kontrollime kas tal on olemas auth token.
        [x] kui on login voi reg leht siis ei kontrolli kas oled sisse logitud.
        [x] muul juhul tahame leida mis kasutajale auth™ token kuulub (express middleware) ((https://expressjs.com/en/guide/using-middleware.html))
        [x] panen user objecti kuhugi muutujasse kirja nii et seda saaks kontrolleris kasutada
        Token 
            [x] on random string mida on raske järgi teha
            [x] on pikk nt 64 tähemärki
            [x] alphanumetrical URLi kaudu saatmiseks
            [x] Crypto library nt bcrypt
        [x] loginis teeme uue sessiooni (sessioon seob random tokeni useriga) useragent,ip,createdat salvetame sessiooni andmebaasi

    ### Login Todo
    [x] login, otsime ules kasutajanime ja parooli
    [x] session expire - max 30 paeva
    [0] konto loomine
    [x] leiad useri ja koik taskid mis kuuluvad sellele userile
    [x] filtreerid koik taskid ja vaatad mis kuuluvad userile
    [0] password encryption

[o] Asenda json failid andmebaasiga.