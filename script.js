const container = document.getElementById('cocktail-container');

fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic')
  .then(response => response.json())
  .then(data => {
    const drinks = data.drinks;

    drinks.forEach(drink => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <div class="card-body">
          <h3>${drink.strDrink}</h3>
          <p>Alcoholic</p>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error al cargar los cócteles:', error);
    container.innerHTML = `<p>Error al cargar los datos.</p>`;
  });
