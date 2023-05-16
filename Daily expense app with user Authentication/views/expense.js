const ulElectronics = document.getElementById("Electronics");
const ulFood = document.getElementById("Food");
const ulSkinCare = document.getElementById("Body Care");

function saveToDatabae(event) {
  event.preventDefault();
  //console.log(event.target.Category.value);
  //   console.log(event.target);
  const price = event.target.Price.value;
  const productName = event.target.Product.value;
  const category = event.target.Category.value;
  const obj = {
    price,
    productName,
    category,
  };
  //   console.log(obj);
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
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

function parseJwt(token) {
  var baseUrl = token.split(".")[1];
  var base = baseUrl.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  axios
    .get("http://localhost:3000/expense/get-expense", {
      headers: { Authorization: token },
    })
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
  let li = `<li id='${user.id}'>${user.price} - ${user.productName} - ${user.category}  <button onclick=deleteUser(event,'${user.id}')>Delete</button></li>`;

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

function deleteUser(e, UserId) {
  //localStorage.removeItem(email)
  const token = localStorage.getItem("token");

  axios
    .delete(`http://localhost:3000/expense/delete-expense/${UserId}`, {
      headers: { Authorization: token },
    })
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
