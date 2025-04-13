# API Apteka

## ⚠️ The project must be running on Node v22.1.0 ⚠️

[Download here](https://nodejs.org/dist/v22.1.0/node-v22.1.0-x64.msi)

## Instructions

1. Open `cmd`
2. Run `node index.js` in the directory.

You do not have to install dependencies if the node_modules folder is already provided to you in the files.


## Authorization
>
> Every request needs to have an "Authorization" header, which can be obtained either from the `/register` or `/login` endpoint.
> The authorization token is a JWT (Json Web Token).

## Fukncje do obsługi bazy danych
## **[register.js](routes\user\register.js)** - POST
>
> * Służy do rejestracji użytkownika
> * Tworzy token jako id do weryfikacji
> * Sprawdza poprawność maila i siłę hasła
> * Generuje sesje (domyślnie na 3 godziny)

> * ### Przyjmuje wartości: 
>   * #### name (TEXT) (min 1, max 64)
>   * #### surname (TEXT) (min 1, max 64)
>   * #### email (TEXT) (min 3, max 64)
>   * #### password (TEXT) (min 8, max 64)
><br/>
## **[login.js](routes\user\login.js)** - POST

> * Służy do logowania się na wcześniej stworzone konto
> * Sprawdza zgodność maila i hasła
> * Zabezpiecza baze przed zbyt częstymi próbami logowania
> * Generuje sesje (domyślnie na 1 godziny)

> * ### Przyjmuje wartości:
>   * #### email (TEXT) (min 3, max 64)
>   * #### password (TEXT) (min 8, max 64)
><br/>

## **[me.js](routes\user\me.js)** - GET
> * Sluzy do pokazywania danych uzytkownika przez token


## **[getDrug.js](routes\drugs\getDrug.js)** - GET
> * Służy do pobrania leku z bazy
> * Dostęp ma każdy poziom permisjii

> * ### Przyjmuje wartości:
> * id (INT) (metoda GET)
><br/>
><br/>

## **[removeDrug.js](routes\drugs\removeDrug.js)** - POST

> * Służy do usuwania z bazy leku o podanym id
> * Dostęp ma jedynie farmaceuta i admin

> * ### Przyjmuje wartości:
> * id (INT)
><br/>
><br/>

## **[updateDrug.js](routes\drugs\updateDrug.js)** - PATCH

> * Służy do aktualizowania danych leku o podanym id
> * Dostęp ma jedynie farmaceuta i admin

> * ### **To jest metoda typu `PATCH`**

> * ### Przyjmuje wartości:
> * id (INT)
> * nazwaPolaDoZmiany (TEXT)
> * wartość (w zależności od pola)
><br/>
><br/>

## **[listDrugs.js](routes\drugs\listDrugs.js)** - GET

> * Służy do wypisywania wszystkich dostępnych leków
> * Dostęp ma klient, farmaceuta i admin

> * ### Obsługa funkcji
> * Funkcja przyjmuje warrtość 'page' w metodzie get
> * Na jedną strone przypada 15 leków
><br/>
><br/>

## **[orderDrug.js](routes\orders\orderDrugs.js)** - POST

>* Służy do kupowania leku w aptece
>* Funkcja usuwa z bazy określoną ilość leku
>* W przypadku braku określonej ilości, zwraca stosowny komunikat
>* Zapisuje w historii kupna użytkownika lek i jego ilość

> * ### Przyjmuje wartości:
> * id (INT)
> * amount (REAL)
><br/>
><br/>

## **[orderHistory.js](routes\orders\orderHistory.js)** - POST

>* Służy do wystawiania raportu danego użytkownika
>* Wypisuje jakie leki, ilość i date kupna

> * ### Przyjmuje wartości:
> * page (INT)
> * limit (INT)
> * filter (ARRAY)
> * descending (BOOL)
> * orderBy (TEXT)
><br/>
><br/>
## **[orderReport.js](routes\orders\orderReport.js)** - POST

>* Służy do wystawiania raportu wszystkich użytkowników
>* Wypisuje jakie leki, ilość i date kupna


> * ### Przyjmuje wartości:
> * page (INT)
> * limit (INT)
> * filter (ARRAY)
> * descending (BOOL)
> * orderBy (TEXT)
><br/>
><br/>

# Filtrowanie
Endpointy `orderReport.js`, `orderHistory.js` zawieraja funkcje filtrowania ktora mozna uzyc przez parametr POST `filter`.
Na przyklad:
```json
{
  "filter": [
    {"companyName":  "test firma"},
    {"amount":  2}
  ]
}
```

W array'u jest obiekt, gdzie klucz jest nazwa filtru a value jest co filtruje w tym kluczu (czego szukamy).




# Schemat bazy danych
## drugs

|   idDrug    | name | dose | price | type | companyName | amount |
|:-----------:|:----:|:----:|:-----:|:----:|:-----------:|:------:|
|     INT     | TEXT | REAL | REAL  | TEXT |    TEXT     |  REAL  |
| primary key |      |      |       |      |             |        |

## purchase_history
|     id      |    purchased     |      user       | amount | date |
|:-----------:|:----------------:|:---------------:|:------:|:----:|
|     INT     |       INT        |      TEXT       |  REAL  | TEXT |
| primary key | (drugs - idDrug) | (users - token) |        |      |
## users

|    token    | name | surname | password | email  | permission |    purchase_history     |
|:-----------:|:----:|:-------:|:--------:|:------:|:----------:|:-----------------------:|
|     INT     | TEXT |  TEXT   |   TEXT   |  TEXT  |    INT     |           INT           |
| primary key |      |         |          | UNIQUE |            | (purchase_history - id) |
