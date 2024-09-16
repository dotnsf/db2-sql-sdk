//. db2-sql-sdk.js
class DB2_SQL_SDK{
  constructor( username, password, deployment_id, base_url ){
    if( username, password, deployment_id, base_url ){
      this.username = username;
      this.password = password;
      this.deployment_id = deployment_id;

      this.base_url = base_url;

      this.access_token = null;

      //await this.get_access_token();
    }
  }

  //. sanitize
  sanitize = function( text ){
    text = text.split( '&' ).join( '&amp;' );
    text = text.split( '<' ).join( '&lt;' );
    text = text.split( '>' ).join( '&gt;' );
    text = text.split( '"' ).join( '&quot;' );
    text = text.split( "'" ).join( '&#039;' );

    return text;
  }

  //. Access Token
  get_access_token = async function(){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var doc = { userid: this.username, password: this.password };
        var result = await fetch( this.base_url + '/dbapi/v4/auth/tokens', {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify( doc ),
          headers: {
	          'x-deployment-id': this.deployment_id,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { token: 'xxxxxx' }
        console.log( 'get_access_token', {json} );
	      if( json && json.token ){
	        this.access_token = json.token;
          r = { status: true };
	      }else{
          r = { status: false, error: 'no access_token retrieved.' };
	      }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  //. SQL
  execSQL = async function( sql ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        sql = 'select TABNAME, TABSCHEMA, OWNER from syscat.tables fetch first 5 rows only;';

        var doc0 = { commands: sql, limit: 10, separator: ';', stop_on_error: 'no' };
        var result0 = await fetch( this.base_url + '/dbapi/v4/sql_jobs', {
          method: 'post',
          body: JSON.stringify( doc0 ),
          headers: {
	          'x-deployment-id': this.deployment_id,
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.access_token
          }
        });
        var json0 = await result0.json();  //. { id: 'xxxx', .. }
        if( json0 && json0.id ){
          var result1 = await fetch( this.base_url + '/dbapi/v4/sql_jobs/' + json0.id, {
            method: 'get',
            headers: {
	            'x-deployment-id': this.deployment_id,
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + this.access_token
            }
          });
          var json1 = await result1.json(); 
          //. body1 は string (?)
          console.log( {json1} );
          if( typeof json1 == 'string' ){ json1 = JSON.parse( json1 ); }
          console.log( {json1} );
          r = { status: true, result: json1 };
        }else{
          r = { status: false, error: 'failed to get sql_jobs_id.' };
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  readTextLocalFile = async function( selector, code ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      var sel = document.querySelector( selector );
      if( sel && sel.files && sel.files.length >= 0 && sel.files[0] ){
        var file = sel.files[0];
        var name = file.name;
  
        var reader = new FileReader();
        reader.addEventListener( 'load', function( e ){
          //console.log( reader.result );  //. data:application/json;base64,xxxxx...
          var data = reader.result;
          console.log( {data} );
          r = { status: true, result: { name: name, text: data } };
          resolve( r );
        });
        reader.readAsText( file, code );
      }else{
        r = { status: false, error: 'no element found for selecor ="' + selector + '".' };
        resolve( r );
      }
    });
  }
}

if( typeof module === 'object' ){
  module.exports = DB2_CRUD_SDK;
}
