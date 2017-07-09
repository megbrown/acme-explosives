"use strict";

let $ = require('jquery');
let categories;
let types;
let products;
let selectedCat;
let typeKeyArr = [];
let typesArr=[];
// let explosiveTypeKeyArr = [];
let catString = "";
let typeString = "";
let productString = "";

let makeProductCard = function() {
	if (selectedCat === "Fireworks"){
		let fireCatVal = Object.keys(categories)[0];
		sortCategory(fireCatVal);
		sortTypes(fireCatVal);
		sortProducts(typeKeyArr, typesArr);
		$("#productContainer").append(productString);
	}
	// else {
	// 	let expCatArr = Object.keys(categories)[1];
	// 	$.each(types, function(key, val) {
	// 		if (expCatArr === val.category_id) {
	// 			// console.log(val.description);
	// 			explosiveTypeKeyArr.push(key);
	// 		}
	// 	});
	// 	$.each(products, function(key, val) {
	// 		if ($.inArray(val.type_id, explosiveTypeKeyArr) !== -1) {
	// 			// console.log(val.name);
	// 		}
	// 	});
	// }
};

let sortCategory = function(fireCatVal) {
	$.each(categories, function(key, val) {
		if (fireCatVal === key) {
			catString += val.name;
		}
	});
	console.log(catString);
	return catString;
};

let sortTypes = function(fireCatVal) {
	$.each(types, function(key, val) {
		if (fireCatVal === val.category_id) {
			typesArr.push({key:key, name:val.name, description:val.description, category_id: val.category_id});
			typeKeyArr.push(key);
		}
	});
};

let sortProducts = function(typeKeyArr, typesArr) {
	console.log(typesArr);
	$.each(products, function(key, val) {
		let counter = 0;
		// if (counter % 3 === 0) {
		// 	productString += `<div class="row">`;
		// }
		if ($.inArray(val.type_id, typeKeyArr) !== -1) {
			productString +=
			`<div class="card" id="${counter}">
			<h1>${catString}</h1>
			<h2>${val.name}</h2>
			<p>${val.description}</p></div>`;
			counter += 1;
		}
		typesArr.forEach( function(typeObj) {
			if(typeObj.key === val.type_id) {
				productString += `<h3>${typeObj.name}</h3>`;
			}
		});
		// if (counter % 3 === 2) {
		// 	productString += `</div>`;
		// }
	});
};

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
