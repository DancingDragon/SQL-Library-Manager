const itemsPerPage = 5;

/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/
function showPage(data, page) {
	let startIndex = page*itemsPerPage-itemsPerPage;
	let endIndex = page*itemsPerPage;
	
	data.forEach((d, i) => {
		if (i<startIndex || i >= endIndex) 
			d.style.display="none";
		else 
			d.style.display="";
	});
}


/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination(list) {
	let nrBtnsNeeded = Math.ceil(list.length / itemsPerPage);
	let linkList = document.querySelector("ul.pagination");
	
	//Add all the page buttons to the linkList
	for (let i = 1; i <= nrBtnsNeeded; i++) {
		linkList.insertAdjacentHTML("beforeend", 
			`<li>
				<button type="button"${i===1 ? ' class="active"':''}>${i}</button>
			</li>`);
	}
	
	//Add clickevent to the buttons
	linkList.addEventListener("click", (e) => {
		//Make sure the object clicked is a button
		if (e.target.type==="button") {
			document.querySelector(".active").className="";
			e.target.className="active";
			showPage(list, parseInt(e.target.textContent));
		}
	}); 
}

// Call functions
let data = document.querySelectorAll(".book");

showPage(data, 1); 
addPagination(data);
