# DB2 SQL SDK Reference


## Pre-requisite 

- Prepare DB2 server with REST API feature

- Your DB2 has to be ..

  - CORS enabled
    - **Impossible** at this moment.

  - and accessible by username and password(Basic Authentication enabled).


## Initialize

### Load `db2-sql-sdk.js` in HTML

```
<script src="https://dotnsf.github.io/db2-sql-sdk/db2-sql-sdk.js"></script>
```


### Initialize `DB2_SQL_SDK` object with (basic authentication)username, password, deployment_id, and base_url of DB2.

```
var db2 = new DB2_SQL_SDK( username, password, deployment_id, base_url );
```

- Use initialized object in following SDKs


## Access Token

### Get Access Token

```
var r = await db2.get_access_token();
```

- Parameter/Result
  - Parameter

  - Result
    - Success
      - `{ status: true, result: { ok: true } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## SQL

### Execute SQL

```
var r = await db2.execSQL( 'select TABNAME, TABSCHEMA, OWNER from syscat.tables fetch first 5 rows only;' );
```

- Parameter/Result
  - Parameter
    - sql
      - SQL text string

  - Result
    - Success
      - `{ status: true, result: { ok: true } }`
    - Failed
      - `{ status: false, error: (error_reason) }`

