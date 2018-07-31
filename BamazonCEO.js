//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

//Connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "root", //Your password
    database: "Bamazon"
});

//Functions
function displayStuffandOtherthings() {
    //show all ids, names, and products from database.
    connection.query('SELECT * FROM Products', function(error, response) {
        if (error) { console.log(error) };
        //New instance of our constructor
        const TableDisplayMagic = new Table({
            //declare the value categories
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            //set widths to scale
            colWidths: [10, 30, 18, 10, 14]
        });
        //for each row of the loop
        for (i = 0; i < response.length; i++) {
            //push data to table
            TableDisplayMagic.push(
                [response[i].ItemID, response[i].ProductName, response[i].DepartmentName, response[i].Price, response[i].StockQuantity]
            );
        }
        //log the completed table to console
        console.log(TableDisplayMagic.toString());
        AskforUpdates();
    });
}; //end displayStuffandOtherthings

function AskforUpdates() {
    //inquire for input
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below to manage your store:",
        choices: ["Restock Inventory", "Add New Product", "Remove An Existing Product"]
    }]).then(function(answers) {
        //select user response, launch corresponding function
        switch (answers.action) {

            case 'Restock Inventory':
                restockRequest();
                break;

            case 'Add New Product':
                addRequest();
                break;

            case 'Remove An Existing Product':
                removeRequest();
                break;
        }
    });
}; //end AskforUpdates

function restockRequest() {
    //gather data from user
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to restock?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to add?"
        },

    ]).then(function(answers) {
        //set captured input as constiables, pass constiables as parameters.
        const quantityAdded = answers.Quantity;
        const IDOfProduct = answers.ID;
        restockDatabase(IDOfProduct, quantityAdded);
    });
}; //end restockRequest

//runs on user parameters from the request function
function restockDatabase(id, quant) {
    //update the database
    connection.query('SELECT * FROM Products WHERE ItemID = ' + id, function(error, response) {
        if (error) { console.log(error) };
        connection.query('UPDATE Products SET StockQuantity = StockQuantity + ' + quant + ' WHERE ItemID = ' + id);
        //re-run display to show updated results
        displayStuffandOtherthings();
    });
}; //end restockDatabase

function addRequest() {
    inquirer.prompt([

        {
            name: "Name",
            type: "input",
            message: "What is the name of the item you wish to stock?"
        },
        {
            name: 'Category',
            type: 'input',
            message: "What is the category for this product?"
        },
        {
            name: 'Price',
            type: 'input',
            message: "How much would you like this to cost?"
        },
        {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to add?"
        },

    ]).then(function(answers){
        //gather user input, store as constiables, pass as parameters
    	const name = answers.Name;
    	const category = answers.Category;
    	const price = answers.Price;
    	const quantity = answers.Quantity;
    	buildNewItem(name,category,price,quantity);
    });
}; //end addRequest

function buildNewItem(name,category,price,quantity){
    //query database, insert new item
	connection.query('INSERT INTO Products (ProductName,DepartmentName,Price,StockQuantity) VALUES("' + name + '","' + category + '",' + price + ',' + quantity +  ')');
    //display updated results
	displayStuffandOtherthings();

};//end buildNewItem

function removeRequest(){
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to remove?"
        }]).then(function(answer){
        	const id = answer.ID;
        	removeFromDatabase(id);
        });
};//end removeRequest

function removeFromDatabase(id){
	connection.query('DELETE FROM Products WHERE ItemID = ' + id);
	displayStuffandOtherthings();
};//end removeFromDatabase

displayStuffandOtherthings();
