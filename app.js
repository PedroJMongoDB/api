const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "asa.sql.admin", // update me
      password: "NoHay2sin3" // update me
    },
    type: "default"
  },
  server: "asaworkspaceqlgyaf7.sql.azuresynapse.net", // update me
  options: {
    database: "SQLPool01", //update me
    encrypt: true,
    trustServerCertificate: false
  }
};

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-vm',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    };

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-app-service',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    });

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

connection.connect();

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP (5) [Region]
,[Country]
,[ProductCategory]
,[CampaignName]
,[Revenue]
,[RevenueTarget]
,[City]
,[State]
 FROM [wwi].[CampaignAnalytics]`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );
  let results = []
  request.on("row", columns => {
    let jsonRow = {};
    columns.forEach(elem => {
        jsonRow[elem.metadata.colName] = elem.value;
    })
    results.push(jsonRow);
    console.log(results);
  });

  connection.execSql(request);
}