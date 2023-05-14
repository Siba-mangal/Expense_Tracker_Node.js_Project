const ulElectronics = document.getElementById("Electronics");
const ulFood = document.getElementById("Food");
const ulSkinCare = document.getElementById("Body Care");

function saveToLocalStorage(event) {
  event.preventDefault();
  //console.log(event.target.Category.value);
  const price = event.target.Price.value;
  const productName = event.target.Product.value;
  const category = event.target.Category.value;
  const obj = {
    price,
    productName,
    category,
  };
  axios
    .post("http://localhost:3000/user/add-expense", obj)
    .then((response) => {
      if (response.status == 201) {
        showListofRegisteredUser(response.data);
      }
      //   showListofRegisteredUser(response.data);
      console.log(response);
    })
    .catch((error) => console.log(error));

  event.target.Price.value = "";
  event.target.Product.value = "";
  event.target.Category.value = "";
  location.reload();
}

window.addEventListener("DOMContentLoaded", (event) => {
  axios
    .get("http://localhost:3000/user/get-expense")
    .then((response) => {
      if (response.status == 201) {
        for (var i = 0; i < response.data.expense.length; i++) {
          showListofRegisteredUser(response.data.expense[i]);
        }
        // console.log(response);
      }
      //   console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

function showListofRegisteredUser(user) {
  let li = `<li id='${user.id}'>${user.price} - ${user.productName} - ${user.category}  <button onclick=deleteUser('${user.id}')>Delete</button></li>`;

  if (user.category == "Electronics") {
    ulElectronics.innerHTML += li;
  }
  if (user.category == "Food") {
    ulFood.innerHTML += li;
  }
  if (user.category == "Body Care") {
    ulSkinCare.innerHTML += li;
  }
}

function deleteUser(UserId) {
  //localStorage.removeItem(email)

  axios
    .delete(`http://localhost:3000/user/delete-expense/${UserId}`)
    .then((response) => {
      if (response.status == 201) {
        removeItemFromScreen(response.data);
        console.log(response);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeItemFromScreen(expense) {
  const category = expense.category;

  const elem = document.getElementById(expense.id);
  if (category == "Electronics") {
    ulElectronics.removeChild(elem);
  }
  if (category == "Food") {
    ulFood.removeChild(elem);
  }
  if (category == "Body Care") {
    ulSkinCare.removeChild(elem);
  }
}
