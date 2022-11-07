console.log("loaded");
const rootElement = document.querySelector("#root");

const beerComponent = (name, price, rating, id) => `
  <div class="beer">
    <h2>${name}</h2>
    <h3>${price}</h3>
    <h4>${rating}</h4>
    <button class="edit beer${id}">edit</button>
  </div>
`;
const beerEditComponent = (name, price, rating, id) => `
  <div class="beer-edit">
    <input class="edit-name" type="text" value=${name} />
    <input class="edit-price" type="number" value=${price} />
    <input class="edit-rating" type="number" value=${rating} />
    <button class="save beer${id}">save</button>
  </div>
`;

fetch("/beers")
  .then((res) => res.json())
  .then((beers) => {
    beers.map((beer) =>
      rootElement.insertAdjacentHTML(
        "beforeend",
        beerComponent(beer.name, beer.price, beer.rating, beer.id)
      )
    );

    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const beerId = e.target.classList[1].substring(4);

        fetch(`/beers/${beerId}`)
          .then((res) => res.json())
          .then((beerData) => {
            console.log(beerData);
            rootElement.insertAdjacentHTML(
              "afterbegin",
              beerEditComponent(
                beerData.name,
                beerData.price,
                beerData.rating,
                beerData.id
              )
            );

            const saveButton = document.querySelector(".save");
            saveButton.addEventListener("click", (e) => {
              const newBeerData = {
                id: parseInt(beerId),
                name: document.querySelector(".edit-name").value,
                price: parseInt(document.querySelector(".edit-price").value),
                rating: parseInt(document.querySelector(".edit-rating").value),
              };

              fetch(`/beers/${beerId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newBeerData),
              })
                .then((res) => res.json())
                .then((resJson) => location.reload());
            });
          });
      });
    });
  });
