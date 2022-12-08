// Init database of users
const users = [];
fetch("./data/users.json")
  .then((res) => res.json())
  .then((data) => users.push(...data))
  .catch((error) => console.log(error));

fetch("./data/users.json")
  .then((res) => res.json())
  .then((data) => users.push(...data))
  .catch((error) => console.log(error));

// Init database of animals
let dogsForAdoption = [],
  catsForAdoption = [],
  bunniesForAdoption = [];

async function renderAnimalsScreen() {
  try {
    const data = await fetch("./data/animals.json");
    const animals = await data.json();
    dogsForAdoption.push(...animals.dogs); // dogsForAdoption = animals.dogs
    catsForAdoption.push(...animals.cats); // catsForAdoption = animals.cats
    bunniesForAdoption.push(...animals.bunnies); // bunniesForAdoption = animals.bunnies

    const cardsContainer = document.getElementsByClassName("cardContainer"),
      dogsContainer = document.getElementById("containerDogs"),
      catsContainer = document.getElementById("containerCats"),
      bunniesContainer = document.getElementById("containerBunnies"),
      messageIndex = document.getElementById("messageIndex"),
      checkButton = document.getElementById("checkButton"),
      toggeable = document.querySelectorAll(".toggeable"),
      cards = document.getElementsByClassName("card"),
      adoptedContainer = document.getElementById("adoptedContainer"),
      adoptedMascots = [],
      finalButton = document.getElementById("completeAdoption");

    addCard(dogsForAdoption, dogsContainer, "dog");
    addCard(catsForAdoption, catsContainer, "cat");
    addCard(bunniesForAdoption, bunniesContainer, "bunny");

    function interactiveCards() {
      if (
        dogsForAdoption !== 0 &&
        catsForAdoption !== 0 &&
        bunniesForAdoption !== 0
      ) {
        for (let animal of cards) {
          animal.addEventListener("click", () => {
            Swal.fire({
              title: "¿Quieres adopar a " + animal.id + "?",
              text: "¡Van a ser muy felices juntos!",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "¡Si, quiero adoptar!",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire(
                  "¡Adoptaste a " + animal.id + "!",
                  "Se va a poner muy contanto/a",
                  "success"
                );

                const type = animal.getAttribute("type"); // dog, cat, bunny

                const allAnimals = [];
                if (type === "dog") {
                  allAnimals.push(...dogsForAdoption);
                } else if (type === "cat") {
                  allAnimals.push(...catsForAdoption);
                } else if (type === "bunny") {
                  allAnimals.push(...bunniesForAdoption);
                }

                finalButton.addEventListener("click", () => {
                  if (adoptedMascots.length == 1) {
                    Swal.fire(
                      "Felicitaciones!",
                      "Has terminado la adopción, te esperamos para que vengas a buscarlo/a!",
                      "success"
                    ).then(() => {
                      adoptedMascots.splice(0);
                      addCard(adoptedMascots, adoptedContainer);
                    });
                  } else if (adoptedMascots.length > 1) {
                    Swal.fire(
                      "Felicitaciones!",
                      "Has terminado la adopción, te esperamos para que vengas a buscarlos/las!",
                      "success"
                    ).then(() => {
                      adoptedMascots.splice(0);
                      addAdoptedCard(adoptedMascots, adoptedContainer);
                    });
                  }
                });

                const chosenMascot = allAnimals.find(
                  (mascot) => mascot.name === animal.id
                );

                adoptedMascots.push(chosenMascot);
                console.log(adoptedMascots);

                if (adoptedMascots.length > 0) {
                  addCard(adoptedMascots, adoptedContainer);
                }

                if (type === "dog") {
                  dogsForAdoption = dogsForAdoption.filter((dog) => {
                    return dog.id != chosenMascot.id;
                  });

                  addCard(dogsForAdoption, dogsContainer, "dog");
                  interactiveCards();
                } else if (type === "cat") {
                  catsForAdoption = catsForAdoption.filter((cat) => {
                    return cat.id != chosenMascot.id;
                  });

                  addCard(catsForAdoption, catsContainer, "cat");
                  interactiveCards();
                } else if (type === "bunny") {
                  bunniesForAdoption = bunniesForAdoption.filter((bunny) => {
                    return bunny.id != chosenMascot.id;
                  });

                  addCard(bunniesForAdoption, bunniesContainer, "bunny");
                  interactiveCards();
                }
              }
            });
          });
        }
      }
    }
    interactiveCards();
  } catch (error) {
    console.log(error);
  }
}

renderAnimalsScreen();

const inputMailLogin = document.getElementById("mailLogin"),
  inputPassLogin = document.getElementById("passLogin"),
  loginButton = document.getElementById("loginButton"),
  loginHeaderButton = document.getElementById("goToFormOne"),
  loginSecondButton = document.getElementById("goToFormTwo"),
  logOutBtn = document.getElementById("logOut"),
  homeTitle = document.getElementById("title"),
  loginForm = document.getElementById("loginForm"),
  errorLogin = document.getElementById("errorLogin");

loginHeaderButton.onclick = (e) => {
  e.preventDefault();
  toggleShowLoginForm();
};

loginSecondButton.onclick = () => {
  toggleShowLoginForm();
};

loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (!inputMailLogin.value || !inputPassLogin.value) {
    errorLogin.innerHTML = `<p>Tienes que rellenar toda la información</p>`;
  } else {
    let data = validateUser(users, inputMailLogin.value, inputPassLogin.value);

    if (!data) {
      errorLogin.innerHTML = `<p>Usuario y/o contraseña erroneos</p>`;
    } else {
      if (checkButton.checked == true) {
        saveData(data, localStorage);
      } else {
        saveData(data, sessionStorage);
      }
      toggleShowPrincipalMenu();
      saluteUser();
    }
  }
});

function toggleShowLoginForm() {
  let toggleAble = document.querySelectorAll(".toggeable");
  for (let x of toggleAble) {
    x.classList.toggle("d-none");
  }
}

function addCard(array, container, type) {
  container.innerHTML = "";
  array.forEach((mascot) => {
    let card = `<div class="card" id="${mascot.name}" type="${type}">
    <img src="${mascot.image}" class="card-img-top" alt="${mascot.name}">
    <div class="card-body">
    <h5 class="card-title">${mascot.name}</h5>
    <p class="card-text">${mascot.name} es de raza: ${mascot.race} y tiene ${mascot.age} años</p>
    </div>
    </div>`;
    return (container.innerHTML += card);
  });
}

function addAdoptedCard(array, container) {
  container.innerHTML = "";
  array.forEach((mascot) => {
    let card = `<div class="card" id="${mascot.name}" type="${type}">
    <img src="${mascot.image}" class="card-img-top" alt="${mascot.name}">
    <div class="card-body">
    <h5 class="card-title">${mascot.name}</h5>
    <p class="card-text">${mascot.name} es de raza: ${mascot.race} y tiene ${mascot.age} años</p>
    </div>
    </div>`;
    return (container.innerHTML += card);
  });
}

function validateUser(usersDB, user, pass) {
  let founded = usersDB.find((userDB) => userDB.userMail == user);

  if (typeof founded === "undefined") {
    return false;
  } else {
    if (founded.userPass != pass) {
      return false;
    } else {
      return founded;
    }
  }
}

function toggleShowPrincipalMenu() {
  let toggleAble = document.querySelectorAll(".toggeableTwo");
  for (let x of toggleAble) {
    x.classList.toggle("d-none");
  }
}

function saveData(usersDB, storage) {
  const user = {
    name: usersDB.userName,
    user: usersDB.userMail,
    pass: usersDB.userPass,
  };

  storage.setItem("user", JSON.stringify(user));
}

function saluteUser() {
  let session = JSON.parse(sessionStorage.getItem("user"));
  let local = JSON.parse(localStorage.getItem("user"));

  if (session) {
    homeTitle.innerHTML = "Hola " + session.name + "! Bienvenido/a a MaxCot!";
  } else if (local) {
    homeTitle.innerHTML = "Hola " + local.name + "! Bienvenido/a a MaxCot!";
  }
  return;
}

function clearData() {
  localStorage.clear();
  sessionStorage.clear();
}

function logOut() {
  let toggleAble = document.querySelectorAll(".toggeableTwo");
  for (let x of toggleAble) {
    x.classList.toggle("d-none");
  }
  homeTitle.innerHTML = `Bienvenido a MaxCot, adopta tu mascota!`;
  errorLogin.innerHTML = " ";
  toggleShowLoginForm();
  resetFormValues();
  clearData();
}

logOutBtn.onclick = () => {
  logOut();
  clearData();
};

function resetFormValues() {
  inputPassLogin.value = "";
  inputMailLogin.value = "";
}

function chosenMascot(array) {
  const compareAnimals = array.find((mascot) => mascot.name === animal.id);
  return compareAnimals;
}

function hideAdoptedMascots() {
  if (adoptedMascots.lenght == 0) {
    adoptedMascotsDiv.classList.add("d-none");
  }
}
