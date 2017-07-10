"use strict";

let $ = require('jquery');
let categories;
let types;
let products;
let selectedCat;
let typeKeyArr = [];
let typesArr=[];
let catString = "";
let typeString = "";
let productString = "";

$("select").change( function() {
  selectedCat = $(this).val();
  getCategories()
  .then( function(dataFromCategories) {
  	categories = dataFromCategories;
  	return getTypes();
  })
  .then( function(dataFromTypes) {
  	types = dataFromTypes;
  	return getProducts(dataFromTypes);
  })
  .then( function(dataFromProducts) {
  	products = dataFromProducts;
  	selectCat();
  })
  .catch( function(err) {
  	console.log("Oops, there was an error:", err);
  });
});

let getCategories = function() {
	return new Promise ( function(resolve, reject) {
		$.ajax({
	  url: "https://acme-explosives-ea213.firebaseio.com/categories.json"
		})
		.done( (categories) => {
		  resolve(categories);
		})
		.fail(reject);
	});
};

let getTypes = function(dataFromCategories) {
	return new Promise ( function(resolve, reject) {
		$.ajax({
  	url: "https://acme-explosives-ea213.firebaseio.com/types.json"
		})
		.done( (types) => {
		  resolve(types);
		})
		.fail(reject);
	});
};

let getProducts = function(dataFromCategories, dataFromTypes) {
	return new Promise ( function(resolve, reject) {
		$.ajax({
  	url: "https://acme-explosives-ea213.firebaseio.com/products.json"
		})
		.done( (products) => {
		  resolve(products);
		})
		.fail(reject);
	});
};

let selectCat = function() {
	if (selectedCat === "Fireworks"){
		let catVal = Object.keys(categories)[0];
		printCard(catVal);
	} else if (selectedCat === "Explosives") {
		let catVal = Object.keys(categories)[1];
		printCard(catVal);
	}
};

let printCard = function(catVal) {
	$("#productContainer").empty();
	typeKeyArr = [];
	typesArr=[];
	catString = "";
	typeString = "";
	productString = "";
	sortCategory(catVal);
	sortTypes(catVal);
	printProducts(typeKeyArr, typesArr);
	$("#productContainer").append(`${productString}`);
};

let sortCategory = function(catVal) {
	$.each(categories, function(key, val) {
		if (catVal === key) {
			catString = val.name;
		}
	});
	return catString;
};

let sortTypes = function(catVal) {
	$.each(types, function(key, val) {
		if (catVal === val.category_id) {
			typesArr.push({key:key, name:val.name, description:val.description, category_id: val.category_id});
			typeKeyArr.push(key);
		}
	});
};

let printProducts = function(typeKeyArr, typesArr) {
	let counter = 0;
	$.each(products, function(key, val) {
		if ($.inArray(val.type_id, typeKeyArr) !== -1) {
			if (counter === 0) {
				productString += `<div class="row">`;
				// counter = 0;
			}
			productString +=
			`<div class="col-sm-4">
			<div class="col-sm-12 card">
			<div id="${counter}">
			<h1>${catString}</h1>
			<h2>${val.name}</h2>
			<p>${val.description}</p>`;
			counter += 1;
		}
		typesArr.forEach( function(typeObj) {
			if(typeObj.key === val.type_id) {
				productString += `<h3>${typeObj.name}</h3></div></div></div>`;
			}
		});
		if (counter === 3) {
			productString += `</div>`;
			counter = 0;
		}
	});
};