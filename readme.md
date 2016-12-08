### setup

1. create db sequlize_development via console or db tool such as pgadmin3.
2. run from console `npm install`

### running migrations to create db tables.

`node_modules/.bin/sequelize db:migrate`

### running seeds
you can run one by one, for example `node_modules/.bin/sequelize db:seed --seed seeders/20161207190508-employees.js`

you can also run them all, by the order they appear in seeders folders `node_modules/.bin/sequelize db:seed:all`

Todo:
 - create the `down` function at employees-offices.js migration.
 - create `Company` model.
   - each office should have `CompanyId`
 - create a seed that will:
   - create a company named 'Acme Inc'
   - create an office for 'Acme Inc'
   - set OfficeId for all unactive employees to the new office.
 - setup test framework with `mocha` & `chai`
 - create `findAllByOfficeName` function at Employee model (modals/employee).
   - function will receive string as input (the office name)
   - function will return an array with employee names that belongs to this office
   - write unit test for the function

### reference
[node-postgres-sequelize](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WEhtdXV95TA)

[example for unit test from our TDD project](https://bitbucket.org/spectory/tddtemplate/src/e20322ad34598b72e5787590c832243b3cc1b493/express_with_react/test/server/models/settings_spec.js?at=master&fileviewer=file-view-default)


###node inspector
allows using dev tools for server code.
https://www.youtube.com/watch?v=03qGA-GJXjI
`./node_modules/.bin/node-inspector bin/www`
`node --debug bin/www`

###Debug
allow using console for debugging
`node debug bin/www`
by default, it stops on the first line of code. so hit `c`.
use the app till you get to the break point.
use `repl` to allow terminal access.