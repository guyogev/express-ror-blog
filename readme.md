# Developing Express like ROR.

Ruby on rails supply a big tool set that allows rapid development right out of the box.

As ROR developer, you might find Express too minimal, but with some tweaking and configurations you can feel right at home.

### Setup

Assuming you've done [installations](https://expressjs.com/en/starter/installing.html) right, creating a new project is pretty easy

```bash
  express myapp
```

This will create a new project under `myapp` folder. The 2 main files:
 - `app.js` - Creates the express app
 - `bin/www` - Run the app in a server.

### ORM configurations
There are a few ORMs you can choose from, the most popular is Sequelize.

```bash
  npm install sequelize sequelize-cli pg pg-hstore  --save
  node_modules/.bin/sequelize init
```

This will create the config/config.json (db configurations, very much the same as rails database.yml)
And folders

 - migrations
 - seeders
 - models

Rails offers `rake db:create/drop`, Sequelize unfortunately does not supply such functionality.

We'll need to setup our DB, in our case we'll use Postgres in other ways. For example via the terminal

```bash
  createdb sequlize_development
```

Next we'll need to connect the ORM to our app.
We'll edit our `bin/www` file so the server will run only after db connection is established by changing

```js
  // bin/www
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
```

to

```js
  // bin/www
  var db = require('../models');

  db.sequelize.sync().then(function() {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  });
```

We need to make sure Sequelize knows how to access our new db.
Here I'm assuming our postgres username and password are both 'postgres'

```js
  // `config/config.js`
  {
    "development": {
      "username": "postgres",
      "password": "postgres",
      "database": "sequlize_development",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "sequlize_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "sequlize_production",
      "host": "127.0.0.1",
      "dialect": "postgres"
    }
  }
```

### Migrations

Sequelize-cli supply quick models/migrations generators, just like `rails generate` command.

```bash
  node_modules/.bin/sequelize model:create --name Employee
```

will create `models/employee.js` & `migrations/TIMESTAMP-create-employee.js`.

```js
  //migrations/TIMESTAMP-create-employee.js;
  module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.createTable('Employees', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    down: function(queryInterface, Sequelize) {
      return queryInterface.dropTable('Employees');
    }
  };
```

```js
  // models/employee.js
  'use strict';
  module.exports = function(sequelize, DataTypes) {
    var Employee = sequelize.define('Employee', {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    }, {
      classMethods: {
        associate: function(models) {
        }
      }
    });
    return Employee;
  };
```

Now we can run our migrations, and roll them back.

```bash
  `node_modules/.bin/sequelize db:migrate`
  `node_modules/.bin/sequelize db:migrate:undo`
```

### DB relations

Relations are similar to Rails, we need to do 2 things
 - add secondary key to the db table
 - add relation deceleration to the model.

Lets add Office & Pets models, and an employee-belongs-to-office, pet-belongs-to-employee & employee-has-many-pets relations

```js
  // migrations/TIMESTAMP-create-office.js
  module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.createTable('Offices', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    down: function(queryInterface, Sequelize) {
      return queryInterface.dropTable('Offices');
    }
  };
```

```js
  // migrations/TIMESTAMP-add-officeid-to-employee.js
  module.exports = {
    up: function (queryInterface, Sequelize) {
      queryInterface.addColumn(
        'Employees',
        'OfficeId',
        Sequelize.INTEGER
      )
    },

    down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('Employees', 'OfficeId')
    }
  };
```

```js
// migrations/TIMESTAMP-create-pet
  module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.createTable('Pets', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        EmployeeId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    down: function(queryInterface, Sequelize) {
      return queryInterface.dropTable('Pets');
    }
  };
```

```js
  // models/pet.js
  module.exports = function(sequelize, DataTypes) {
    var Pet = sequelize.define('Pet', {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      EmployeeId: DataTypes.INTEGER
    }, {
      classMethods: {
        associate: function(models) {
          Pet.belongsTo(models.Employee)
        }
      }
    });
    return Pet;
  };
```

```js
  // models/employee.js
  'use strict';
  module.exports = function(sequelize, DataTypes) {
    var Employee = sequelize.define('Employee', {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      OfficeId: DataTypes.INTEGER
    }, {
      classMethods: {
        associate: function(models) {
          Employee.belongsTo(models.Office);
          Employee.hasMany(models.Pet);
        }
      }
    });
    return Employee;
  };
```

### seeds

Sequelize seeds has some what different approach then Rails standards. They look and behave like migrations.

One of the most annoying things about sequelize seeds is that they interact directly with your db, and not the model.
So if we define default values at our model **they won't be set by the seed**.
In our example, the null values at *createdAt* & *updatedAt* will raise exceptions during the seed execution.
This is why we must manually define `now` variable at our seeds below

Lets create seeds for employees and offices.

```bash
  node_modules/.bin/sequelize seed:create --name employees
  node_modules/.bin/sequelize seed:create --name offices
```

```js
  // seeders/TIMESTAMP-employees.js
  function createEmployee(index) {
    var now = new Date();
    return { 
      active: Math.random() > .5, // randomize active == true OR false
      name: "name-"+index,
      createdAt: now,
      updatedAt: now
    }
  }

  function generateEmployees () {
    var i;
    var employees = [];
    for (i = 0; i < 100; i++) {
      employees.push(createEmployee(i));
    }
    return employees;
  }

  module.exports = {
    // insert 100 employees to db
    up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Employees', generateEmployees(), {});
    },

    // delete ALL employees from db
    down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Employees', null, {});
    }
  };

```
We can run the seeds one by one

```bash 
  node_modules/.bin/sequelize db:seed --seed seeders/TIMESTAMP-employees.js
  node_modules/.bin/sequelize db:seed --seed seeders/TIMESTAMP-offices.js
```
Or all by the order they were created

```bash 
  node_modules/.bin/sequelize db:seed:all
```

And we can roll them back

```
  node_modules/.bin/sequelize db:seed:undo --seed seeders/TIMESTAMP-employees.js
  node_modules/.bin/sequelize db:seed:undo:all
```

### Customized seeds
Personally I like seeds that are 'standalone', and are not affected by other seeds in our system, or the creation order.
This is why usually I add a setup such as [this](http://stackoverflow.com/a/19872375/6767060) to my rails apps.

Such setup in Sequelize can be simply defined by node scripts.
Another plus, is that we use our models logic, so default values & validations will behave as expected.

```js
// seeders_custom/seed_for_dev.js
var db = require('../models/index');

function createEmployee(index) {
  return { 
    active: Math.random() > .5, // randomize active == true OR false
    name: "bulk-name-"+index
  }
}

function generateEmployees () {
  var i;
  var employees = [];
  for (i = 0; i < 100; i++) {
    employees.push(createEmployee(i));
  }
  return employees;
}

var employees = generateEmployees();

var offices = [
  { 
    active: true,
    name: "office 3"
  },
  { 
    active: true,
    name: "office 4"
  }
]

var pets = [
  { 
    active: true,
    name: "lucky"
  },
  { 
    active: true,
    name: "flipper"
  }
]

db.Employee.destroy({where: {}}).then(function () {});
db.Office.destroy({where: {}}).then(function () {});

db.Employee.bulkCreate(employees);
db.Pet.bulkCreate(pets);
db.Office.bulkCreate(offices);

db.Office.findOne({where: { name: 'office 3' }})
  .then(function(office) {
      return db.Employee.update(
        { OfficeId: office.id },
        {where: {active: {$eq: true}}}
      )
  })

db.Employee.findOne({where: { name: 'bulk-name-1' }})
  .then(function(employee) {
      return db.Pet.update(
        { EmployeeId: employee.id },
        {where: {active: {$eq: true}}}
      )
  })
```

### Queries
Queries over a single model are pretty straight foreword

```js
  var db = require('../models')
  db.Office.findOne({
    where: {name: 'office 3'}
  })
```

But queries over multiple tables can lead to
 - inefficient db access such as N+1 queries
 - callback hell.

Sequelize [eager loading](http://docs.sequelizejs.com/en/latest/docs/models-usage/#eager-loading) can simplify such queries

```js
  // all the pets that belongs to employees from `office 3`
  var db = require('../models')
  db.Pet.findAll({
      include: [{
        model: db.Employee,
        include: [{
          model: db.Office,
          where: {
            name: "office 3"
          },
          required: false
        }]
      }]
    }).then(function(pets) {
      JSON.stringify(pets)
      });
    })
```

Another way to simply such queries is to force synchronous execution by using ES7 async/await. This is described at [this blog post](https://www.spectory.com/blog/Async%20tests%20with%20mocha%20in%20node)

### Debugging
Setting up debuggers with Rails is very easy. Just drop in `byebug` or `pry` gems into your Gemfile and you're up and running.

With Express, its requires some more medalling.
Some IDE's such as Visual Code & WebStorm supply their own debuggers setup,
but I prefer all my team members to be able to debug their code without triggering IDE war at the office.

#### Node Inspector
Node-inspector allows using chrome dev tools on server code.
If you're a front end developer, you'll be right at home.
Basically node-inspector observe the node app we wish to debug, and allows us to interact with it in runtime.

This [video](https://www.youtube.com/watch?v=03qGA-GJXjI) covers the setup. In short, it something like this
```bash
  npm install node-inspector --save-dev
  # run node inspector
  ./node_modules/.bin/node-inspector bin/www
  # run server in debug mode
  node --debug bin/www
```
Now every breakpoint (or `debugger` command in the code) will pause the server execution.
We can view the dev tools under http://127.0.0.1:8080/?port=5858

#### Node Debug
Pausing the code at runtime and view the call stack is nice,
but what if we what to dig deeper and manually execute commands while in a break point?
Node debug allow using console while debugging by triggering Repeat-Eval-Print-Loop.

```bash
  node debug bin/www
```

 - Note that by default, it stops on the first line of code. So hit `c` to continue.
 - When reaching a breakpoint type `repl` to allow terminal interaction.

### Additional reference
 - [node-postgres-sequelize](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WEhtdXV95TA)
 - [code base for this post](https://github.com/guyogev/express-ror-blog)