# ceneOo

* Install dependencies: `npm i`.
* Run `npm run build:dev` or `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.
* Run `npm run build:exe` to generate executables files (for win, mac and linux). They will be created in the root folder.
* Run `npm run start:dev` or `npm run start:prod` to scan goods (either `dev` mode or `prod`).
* Run `npm run zip-exe` to archive the executable scripts.
## `Config` file

* Create `config` file in the root folder (based on `config.example` file) and set environment variables for the active [Insights](https://insights.datylon.com) user:
    * `OUTPUT` = path to the output folder regarding the root folder (by default it is equal to `result` folder, which will be created in the root folder)
    * `DATA_FILE` = the data file name, tha should be scanned; should be located in the root folder
    * `SCRIPT_TYPE` = script type that store the data about a goods (open a link => console => see network tab)
    * `APPROACHES` = how many approaches will be done to scan the data (default is 1)
    * `THREADS_AMOUNT` = how many goods are being scanned without tymeout (default is 1)
    * `WAIT_DURING` = in milliseconds; How much time we are waiting between threads 
    * `WAIT_AFTER` = in milliseconds; How much time we are waiting between approaches
