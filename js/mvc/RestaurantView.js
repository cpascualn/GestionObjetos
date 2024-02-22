const EXCECUTE_HANDLER = Symbol('excecuteHandler');
class RestaurantView {

	constructor() {
		this.categories = document.getElementById('categories');
		this.list = document.getElementById('listado');
		this.allergens = document.getElementById('allergens');
		this.menus = document.getElementById('menus');
		this.headText = document.getElementById("head_text");
		this.restaurants = document.getElementById("restaurants");
		this.dishWindows = null;
	}

	[EXCECUTE_HANDLER](handler, handlerArguments, scrollElement, data, url,
		event) {
		handler(...handlerArguments);
		const scroll = document.querySelector(scrollElement);
		if (scroll) scroll.scrollIntoView();
		//$(scrollElement).get(0).scrollIntoView();
		history.pushState(data, null, url);
		event.preventDefault();
	}


	bindInit(handler) { // enlazar el manejador de los botones de inicio con los botones en el html

		document.getElementById('init').addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#', event);
		});
		document.getElementById('logo').addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#', event);

		});
	}

	bindShowDish(handler) {
		const cards = document.querySelectorAll('div.card');
		for (const card of cards) {
			let boton = card.querySelector('button.btn')
			let dish = boton.id;
			boton.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[dish],
					'#listado',
					{ action: 'showDish', dish },
					'#',
					event,
				);
			});
		}
	}

	bindCategoryList(handler) { // enlazar el manejador de los botones de las categorias con los botones en el html
		const categoryList = document.getElementById('category-list');
		const links = categoryList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const category = enlace.dataset.category;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[category],
					'#listado',
					{ action: 'showCategoryDishes', category },
					'#' + category,
					event,
				);
			});
		}
	}

	bindAllerList(handler) { // enlazar el manejador del  boton alergenos del menu
		this.allergens.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'#categories',
				{ action: 'showAllerList' },
				'#alergenos',
				event,
			);
		});

	}

	bindAllergen(handler) { // enlazar el manejador de los botones de los alergenos
		const allergenList = document.getElementById('allergen-list');
		const links = allergenList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const allergen = enlace.dataset.allergen;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[allergen],
					'#listado',
					{ action: 'showAllerDishes', allergen },
					'#' + allergen,
					event,
				);
			});
		}
	}

	bindMenuList(handler) {// enlazar el manejador del  boton menus del menu
		this.menus.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'#categories',
				{ action: 'showMenuList' },
				'#menus',
				event,
			);
		});

	}

	bindMenu(handler) {// enlazar el manejador de los botones de los menus
		const menuList = document.getElementById('menus-list');
		const links = menuList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const menu = enlace.dataset.menu;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[menu],
					'#listado',
					{ action: 'showMenuDishes', menu },
					'#' + menu,
					event,
				);
			});
		}
	}

	bindRestaurant(handler) { // enlazar manejador del desplegable de restaurantes
		const links = this.restaurants.querySelectorAll('li');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const restaurant = enlace.dataset.restaurant;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[restaurant],
					'#listado',
					{ action: 'showRestaurant', restaurant },
					'#' + restaurant,
					event,
				);
			});
		}
	}

	bindShowDishInNewWindow(handler) {
		const botones = document.querySelectorAll('button.btn.btn-primary');
		for (const boton of botones) {
			boton.addEventListener('click', (event) => {
				let dish = event.target.dataset.dname;
				if (!this.dishWindows || this.dishWindows.closed) {
					this.dishWindows = window.open('dish.html', 'DishWindow',
						'width=800, height=600, top=250, left=250, titlebar=yes, toolbar=no,menubar=no, location=no');

					this.dishWindows.addEventListener('DOMContentLoaded', () => {
						this[EXCECUTE_HANDLER](
							handler,
							[dish],
							'#listado',
							{ action: 'showDishInNewWindow', dish },
							'#' + dish,
							event,
						);

					});
				} else {
					this[EXCECUTE_HANDLER](
						handler,
						[dish],
						'#listado',
						{ action: 'showDishInNewWindow', dish },
						'#' + dish,
						event,
					);
					this.dishWindows.focus();
				}
			});
		}
	}

	bindCloseWindows(handler) {
		
		const bClose = document.getElementById('windowsCloser');
		bClose.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'.header',
				{ action: 'closeWindows' },
				'#',
				event,
			);
		});
	}


	modifyBreadcrumb(category) { // metodo para modificar las migas de pan, si recibe null se borra y vuelve al inicio, si no se añade la nueva ubicacion
		let bc = document.getElementById('breadcrumb');
		// si ya tiene un hijo , se borra para reemplazarlo por el nuevo
		if (bc.children[1] !== undefined) {
			bc.removeChild(bc.children[1]);
		}
		if (category !== null) {
			bc.insertAdjacentHTML('beforeend', `
			<li class="breadcrumb-item active" aria-current="page">${category}</li>
	
			 `);
		}

	}

	showCategories(categories) { // mostrar el menu de categorias
		this.headText.innerHTML = "INICIO";
		// hacer que se borren todos los que habia antes
		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'category-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const category of categories) {
			container.insertAdjacentHTML('beforeend', `<div class="col-lg-3 colmd-6 nav-item"><a data-category="${category.name}" href="#${category.name}" class="nav-link">
		<h4>${category.name}</h4>
		</a>
		</div>`);
		}
		this.categories.append(container);
	}

	showDishes(dishes) { // mostrar los platos , cada vez que se llama a este metodo , los platos anteriores se borran del html
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		// si llegan 3 platos, cambiar el css para que queden centrados
		if (dishes.length <= 3) {
			this.list.classList.add('nav');
		} else
			this.list.classList.remove('nav');


		for (const dish of dishes) {
			const container = document.createElement('div');
			container.classList.add('card');
			container.style.width = '18rem';

			let name = dish.name.replace(/\s/g, '');
			// mostrar un boton de boostrap que abre un modal con la ficha del plato
			container.insertAdjacentHTML('beforeend', `<img src="${dish.image}" class="card-img-top" alt="...">
			<div class="card-body">
		    <h5 class="card-title"  > ${dish.name} </h5> 
			</div>
			</div>
			<button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#Modal${name}" id="${name}"> SABER MÁS
  			</button>

			  <div class="modal fade" id="Modal${name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
				  <div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">${dish.name}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				  </div>
				  <div class="modal-body">
					<img src="${dish.image}" alt="">
					<h5>${dish.description}</h5>
					<p><b>INGREDIENTES:</b> ${dish.ingredients}</p>
				  </div>
				  <div class="modal-footer">
				  <button data-dname="${name}" class="btn btn-primary text-uppercase mr-2 px-4">Abrir en nueva ventana</button>
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				  </div>
				</div>
			  </div>
			</div>
			 `);

			this.list.append(container);
		}
	}


	showDishInNewWindow(dish, message) {

		const platosDiv = this.dishWindows.document.getElementById('plato');
		const header = this.dishWindows.document.getElementById('h-title');
		if (platosDiv !== null) {
			platosDiv.replaceChildren();
		}


		if (dish !== null) {
			header.innerHTML = dish.name;
			this.dishWindows.document.title = `${dish.name}`;
			platosDiv.insertAdjacentHTML('beforeend', `
			<img src="${dish.image}" alt>
			<h5>${dish.description}</h5>
			<p><b>INGREDIENTES:</b> ${dish.ingredients}</p>
			<button type="button" class="btn btn-secondary" id="b-close" onclick="window.close()">Close</button>
			`);
		} else {
			if (platosDiv !== null) {
				platosDiv.insertAdjacentHTML('beforeend', `<div class="row d-flex justify-content-center">${message}</div>`);
			}

		}
		this.dishWindows.document.body.scrollIntoView();
	}

	showAllergens(allergens) { // mostrar el menu de alergenos
		this.headText.innerHTML = "ALÉRGENOS";
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'allergen-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const allergen of allergens) {
			container.insertAdjacentHTML('beforeend', `<div class="col  nav-item"><a data-allergen="${allergen.name}" href="#${allergen.name}" class="nav-link">
			<h4>${allergen.name}</h4>
			</a>
			</div>`);
		}
		this.categories.append(container);

	}

	showMenus(menus) { // mostrar el menu de menus
		this.headText.innerHTML = "MENUS";
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'menus-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const menu of menus) {
			container.insertAdjacentHTML('beforeend', `<div class="col-lg-3 col-md-3 nav-item"><a data-menu="${menu.name}" href="#${menu.name}" class="nav-link">
			<h4>${menu.name}</h4>
			</a>
			</div>`);
		}
		this.categories.append(container);
	}

	loadRestaurants(restaurants) { // cargar el desplegable de restaurantes con los restaurantes que tenga el MODEL
		for (const restaurant of restaurants) {
			let container = document.createElement('li');
			let link = document.createElement('a');
			link.href = '#' + restaurant.name.replace(/\s/g, '');
			link.classList.add('dropdown-item');
			link.innerHTML = restaurant.name;
			link.dataset.restaurant = restaurant.name.replace(/\s/g, '');
			container.appendChild(link);

			this.restaurants.append(container);
		}
	}

	showRestaurant(restaurant) { // mostrar la ficha del restaurante
		this.headText.innerHTML = restaurant.name;

		this.categories.innerHTML = '';
		this.list.innerHTML = '';

		let location = restaurant.location;
		let maps;
		if (restaurant.name === 'Restaurante de Madrid') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=madrid+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">GPS devices</a></iframe></div>`
		} else if (restaurant.name === 'Restaurante de Barcelona') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Les%20Rambles,%201%20Barcelona,%20Spain+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">GPS car tracker</a></iframe></div>`;

		} else if (restaurant.name === 'Restaurante de Sevilla') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=sevilla+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">Car Navigation Systems</a></iframe></div>`;
		}
		const container = document.createElement('div');
		container.insertAdjacentHTML('beforeend', `<div>
			<h5>${restaurant.description}</h5>
			<h3>LOCALIZACION</h3>
			<h5>LATITUD:${location.latitude}</h5>
			<h5>LONGITUD:${location.longitude}</h5>
			${maps}
			</div>`);
		this.list.append(container);
	}

	closeWindows() {
		if (this.dishWindows !== null) {
			this.dishWindows.window.close();
		}
	}

}
export default RestaurantView;
