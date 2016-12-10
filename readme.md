### setup

1. create db sequlize_development via console or db tool such as pgadmin3.
2. run from console `npm install`

### migrations.

`node_modules/.bin/sequelize db:migrate`

### seeds
you can run one by one, for example `node_modules/.bin/sequelize db:seed --seed seeders/20161207190508-employees.js`

you can also run them all, by the order they appear in seeders folders `node_modules/.bin/sequelize db:seed:all`

### customized seeds
run as node script

### queries

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


### reference
[node-postgres-sequelize](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WEhtdXV95TA)

[example for unit test from our TDD project](https://bitbucket.org/spectory/tddtemplate/src/e20322ad34598b72e5787590c832243b3cc1b493/express_with_react/test/server/models/settings_spec.js?at=master&fileviewer=file-view-default)