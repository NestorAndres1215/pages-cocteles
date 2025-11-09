        const cocktailContainer = document.getElementById('cocktail-container');
        const pagination = document.getElementById('pagination');
        const categoryButtons = document.getElementById('category-buttons');
        const categoryCocktails = document.getElementById('category-cocktails');
        const itemsPerPage = 9;
        let currentPage = 1;
        let drinks = [];
        let currentCategory = '';

        function displayCocktails(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedDrinks = drinks.slice(start, end);

            cocktailContainer.innerHTML = '';
            paginatedDrinks.forEach((drink, index) => {
                const card = document.createElement('div');
                card.className = 'col';
                card.style.setProperty('--i', index);
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}" onerror="this.src='https://via.placeholder.com/250x200?text=${encodeURIComponent(drink.strDrink)}'">
                        <div class="card-body">
                            <h5 class="card-title">${drink.strDrink}</h5>
                            <p class="card-text">Bebida Alcohólica</p>
                        </div>
                    </div>
                `;
                cocktailContainer.appendChild(card);
            });
        }

        function setupPagination() {
            const pageCount = Math.ceil(drinks.length / itemsPerPage);
            pagination.innerHTML = '';

            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#cocktails">Anterior</a>`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    displayCocktails(currentPage);
                    updatePagination();
                    window.scrollTo({ top: document.getElementById('cocktails').offsetTop - 100, behavior: 'smooth' });
                }
            });
            pagination.appendChild(prevLi);

            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);
            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                const firstLi = document.createElement('li');
                firstLi.className = 'page-item';
                firstLi.innerHTML = `<a class="page-link" href="#cocktails">1</a>`;
                firstLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = 1;
                    displayCocktails(currentPage);
                    updatePagination();
                    window.scrollTo({ top: document.getElementById('cocktails').offsetTop - 100, behavior: 'smooth' });
                });
                pagination.appendChild(firstLi);

                if (startPage > 2) {
                    const ellipsisLi = document.createElement('li');
                    ellipsisLi.className = 'page-item disabled';
                    ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
                    pagination.appendChild(ellipsisLi);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const li = document.createElement('li');
                li.className = `page-item ${i === currentPage ? 'active' : ''}`;
                li.innerHTML = `<a class="page-link" href="#cocktails">${i}</a>`;
                li.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    displayCocktails(currentPage);
                    updatePagination();
                    window.scrollTo({ top: document.getElementById('cocktails').offsetTop - 100, behavior: 'smooth' });
                });
                pagination.appendChild(li);
            }

            if (endPage < pageCount) {
                if (endPage < pageCount - 1) {
                    const ellipsisLi = document.createElement('li');
                    ellipsisLi.className = 'page-item disabled';
                    ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
                    pagination.appendChild(ellipsisLi);
                }

                const lastLi = document.createElement('li');
                lastLi.className = 'page-item';
                lastLi.innerHTML = `<a class="page-link" href="#cocktails">${pageCount}</a>`;
                lastLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = pageCount;
                    displayCocktails(currentPage);
                    updatePagination();
                    window.scrollTo({ top: document.getElementById('cocktails').offsetTop - 100, behavior: 'smooth' });
                });
                pagination.appendChild(lastLi);
            }

            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#cocktails">Siguiente</a>`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < pageCount) {
                    currentPage++;
                    displayCocktails(currentPage);
                    updatePagination();
                    window.scrollTo({ top: document.getElementById('cocktails').offsetTop - 100, behavior: 'smooth' });
                }
            });
            pagination.appendChild(nextLi);
        }

        function updatePagination() {
            setupPagination();
        }

        fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
            .then(response => response.json())
            .then(data => {
                categoryButtons.innerHTML = '';
                data.drinks.forEach(category => {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-primary';
                    btn.textContent = category.strCategory;
                    btn.addEventListener('click', () => {
                        currentCategory = category.strCategory;
                        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category.strCategory)}`)
                            .then(res => res.json())
                            .then(catData => {
                                categoryCocktails.innerHTML = '';
                                catData.drinks.slice(0, 9).forEach((drink, index) => {
                                    const card = document.createElement('div');
                                    card.className = 'col';
                                    card.style.setProperty('--i', index);
                                    card.innerHTML = `
                                        <div class="card h-100">
                                            <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}" onerror="this.src='https://via.placeholder.com/250x200?text=${encodeURIComponent(drink.strDrink)}'">
                                            <div class="card-body">
                                                <h5 class="card-title">${drink.strDrink}</h5>
                                                <p class="card-text">${category.strCategory}</p>
                                            </div>
                                        </div>
                                    `;
                                    categoryCocktails.appendChild(card);
                                });
                            })
                            .catch(error => {
                                console.error('Error al cargar los cócteles de la categoría:', error);
                                categoryCocktails.innerHTML = `<p class="text-center text-danger">Error al cargar los cócteles. Por favor, intenta de nuevo.</p>`;
                            });
                    });
                    categoryButtons.appendChild(btn);
                });
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
                categoryButtons.innerHTML = `<p class="text-center text-danger">Error al cargar las categorías. Por favor, intenta de nuevo.</p>`;
            });

        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic')
            .then(response => response.json())
            .then(data => {
                drinks = data.drinks;
                displayCocktails(currentPage);
                setupPagination();
            })
            .catch(error => {
                console.error('Error al cargar los cócteles:', error);
                cocktailContainer.innerHTML = `<p class="text-center text-danger">Error al cargar los datos. Por favor, intenta de nuevo más tarde.</p>`;
            });