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


## How to scan

In the root folder you should have:
* the data file with the name specified in config file
* `config` file (see the `Config` file topic);
* executable file(s) `scan-win`, `scan-macos`, `scan-linux` (at least the one according to your OS: win, mac or linux)

* If your OS is win. Just double-click on the `scan-win` file
* If your OS is macos:
1) you need to allow `scan-macos` file to be used. So right click on it and choose open. It will be ran, but the result will be the error (because the required environment variables will not be taken into account)
2) open terminal at the root folder and run `scan-macos` in terminal `./scan-macos`
3) or as an alternative as the first step open terminal and type `chmod -R 777 ./scan-macos`. Then you can just double click on `scan-macos`
* If your OS is linux. Open terminal at the root folder and run `scan-linux` in terminal `./scan-linux`


## Results

* As the result of scanning the output folder is created in the root folder (It is called according to your `config` file). It contains the `result.xlsx` file with information
* Also, the `logs` file is created. It contains all the messages appeared during the last scanning process