"use strict";

let $ = require('jquery');
let categories;
let types;
let products;
let selectedCat;
let fireworkTypeKeyArr = [];
let explosiveTypeKeyArr = [];
let counter = 0;

// function assignIDValues(data) {
// 	console.log('data', data);
// 		let keyIDs = Object.keys(data);
// 		// console.log('data with key', keyIDs);
// 		$.each(categories, function(key, val) {
// 			console.log('val.name', val.name);
// 			if ($.inArray(val.name, keyIDs) !== -1) {
// 				// selectedCat = val.name
// 				}
// 		});
// 		console.log("select", selectedCat);
// 		// if (selectedCat === val.name) {

// 		// }
// }

let makeProductCard = function() {
	let domString = "";
	if (selectedCat === "Fireworks"){
		let fireCatVal = Object.keys(categories)[0];
		$.each(categories, function(key, val) {
			if (fireCatVal === key) {
				domString += `<h1>${val.name}</h1>`;
			}
		});
		$.each(types, function(key, val) {
			if (fireCatVal === val.category_id) {
				fireworkTypeKeyArr.push(key);
				domString += `<h3>${val.name}</h3>`;
			}
		});
		$.each(products, function(key, val) {
				if (counter % 3 === 0) {
					domString += `<div class="row">`;
				}
				if ($.inArray(val.type_id, fireworkTypeKeyArr) !== -1) {
					domString += `<div class="card" id="${counter}"><h2>${val.name}</h2>`;
					domString += `<p>${val.description}</p></div>`;
					counter += 1;
				}
				if (counter % 3 === 2) {
					domString += `</div>`;
				}
		});
		$("#productContainer").append(domString);
}
	else {
		let expCatArr = Object.keys(categories)[1];
		$.each(types, function(key, val) {
			if (expCatArr === val.category_id) {
				// console.log(val.description);
				explosiveTypeKeyArr.push(key);
			}
		});
		$.each(products, function(key, val) {
			if ($.inArray(val.type_id, explosiveTypeKeyArr) !== -1) {
				// console.log(val.name);
			}
		});
	}
};

$("select").change( function() {
  selectedCat = $(this).val();
  getCategories()
  .then( function(dataFromCategories) {
  	categories = dataFromCategories;
  	// console.log('categories', categories);
  	// assignIDValues(categories);
  	return getTypes();
  })
  .then( function(dataFromTypes) {
  	types = dataFromTypes;
  	return getProducts(dataFromTypes);
  })
  .then( function(dataFromProducts) {
  	products = dataFromProducts;

  	makeProductCard();
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
