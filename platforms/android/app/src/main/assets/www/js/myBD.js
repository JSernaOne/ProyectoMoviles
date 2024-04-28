var db = null;

document.addEventListener('DOMContentLoaded', function() {
  window.sqlitePlugin.openDatabase({
    name: 'my.db',
    location: 'default',
  }, function(dbObject) {
    db = dbObject;
    agregarEventListeners();
  }, function(error) {
    console.error('Error al abrir la base de datos: ' + JSON.stringify(error));
  });
});

function agregarEventListeners() {
  document.getElementById('connect').addEventListener('click', function() {
    createTable();
    insertRecord();
    queryDB();
  });
}

function createTable() {
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
  }, function(error) {
      console.error('Error al crear la tabla: ' + error.message);
    }, function() {
      console.log('Tabla creada correctamente');
    });
}

function insertRecord() {
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO DemoTable VALUES (?, ?)', ['Alice', 101]);
    tx.executeSql('INSERT INTO DemoTable VALUES (?, ?)', ['Betty', 202]);
  }, function(error) {
      console.error('Error al insertar registros: ' + error.message);
    }, function() {
      console.log('Registros insertados correctamente');
    });
}

function queryDB() {
  db.transaction(function(tx) {
    tx.executeSql('SELECT count(*) AS mycount FROM DemoTable', [], function(tx, rs) {
      console.log('Número de registros en la tabla: ' + rs.rows.item(0).mycount);
    }, function(tx, error) {
      console.error('Error al consultar la base de datos: ' + error.message);
    });
  });
}
