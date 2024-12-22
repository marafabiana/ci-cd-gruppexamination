# Gruppexamination: CI / CD.

## Bakgrund

I denna gruppexamination ska ni bygga en fullstack-app för kunna se och anmäla sig till meetups.

## Instruktioner

Ni ska arbeta enligt git flow och bygga en fullstack-app som kommer vara deployad till AWS Amplify eller en S3-bucket.

#### User stories

Här hittar ni alla user stories som ska implementeras i denna gruppexamination. Enklast är att skapa ett eget projekt och kopiera över alla user stories manuellt.

https://github.com/users/zocom-christoffer-wallenberg/projects/15/views/1

#### Arbetsgång

Det ska finnas en main-branch och när man gör en pull request till main så deployas er frontend. Ni ska ha en dev-branch (som simulerar en testmiljö) med en YAML för Github actions och när man gör en push till dev så deployar den er frontend. Observera att detta enbart gäller er frontend. Ni kan använda antingen Amplify eller en S3-bucket. För "testmiljön" så funkar det även att använda Github pages. Observera att en miljö måste använda Github actions.

När ni utvecklar så gör en feature-branch som kopplas till en user story och när ni känner er redo som gör en pull request och få en code review och sen merga in i dev. Vid valda tillfällen kan ni sen merga in i main. Syftet här är att simulera hela utvecklingskedjan.

#### Tekniska krav

Frontend ska vara byggd i React och det ska finnas en backend med databas. Ni får använda något annat än AWS och DynamoDB om ni önskar men tänk på att allt ska vara deployat till molnet så ert API och databas kan inte enbart fungera lokalt. Ifall man önskar använda något annat än AWS så är ett tips att kolla in render.com för att deploya ert API.

## Betygskriterier


**För Godkänt:**
* Ska vara deployad på AWS Amplify eller en S3-bucket
* Vara en fullstack applikation
* Det ska finnas en main branch som deployas till AWS Amplify eller en S3-bucket med Github pages
* Det ska finnas en dev branch som deployas till en S3-bucket eller Github pages med Github actions
* En YAML för Github actions
* Implementerat alla user stories för Godkänt

**För Väl Godkänt:**
* Alla kriterier för Godkänt
* Implementerat alla user stories för Väl Godkänt

