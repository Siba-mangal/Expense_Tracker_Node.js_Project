document.querySelector("#plus-icon").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});
document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });
document
  .querySelector(".popup .add-expense")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });

const expenses = document.getElementById("expenses");

function saveToDatabase(e) {
  e.preventDefault();
  const price = e.target.Price.value;
  const productName = e.target.Product.value;
  const category = e.target.Category.value;
  const obj = {
    price,
    productName,
    category,
  };
  console.log(obj);
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status == 201) {
        showListofRegisteredUser(response.data);
      }
      console.log(response);
    })
    .catch((error) => console.log(error));

  e.target.Price.value = "";
  e.target.Product.value = "";
  e.target.Category.value = "";
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
function showPremiumuserMessage() {
  document.getElementById("rzp-button").style.visibility = "hidden";
  // document.getElementById("message").innerHTML = "You are a premium user ";
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const ispremiumuser = decodeToken.ispremiumuser;
  if (ispremiumuser) {
    showPremiumuserMessage();
    showLeaderboard();
  }
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
  let li = `<li class="liList" id='${user.id}'>${user.price} - ${user.productName} - ${user.category}  <button style="width:50px;font-size:10px" onclick=deleteUser(event,'${user.id}')>Delete</button></li>`;
  expenses.innerHTML += li;
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
  const elem = document.getElementById(expense.id);
  expenses.removeChild(elem);
}

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Leaderboard";
  inputElement.classList.add("leaderboard");
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get(
      "http://localhost:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);

    let learderboardElem = document.getElementById("leaderboard");
    learderboardElem.innerHTML += "<h1>Leader Board</h1>";
    userLeaderBoardArray.data.forEach((userDetails) => {
      learderboardElem.innerHTML += `<li>Name - ${
        userDetails.username
      } Total Expense - ${userDetails.total_cost || 0} </li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

document.getElementById("rzp-button").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      // console.log(res);
      alert("You are a Premium User Now");
      document.getElementById("rzp-button").style.visibility = "hidden";
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert("Something went wrong");
  });
};

function download() {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:3000/expense/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status == 201) {
        // console.log(response.data);
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        // throw new Error();
        console.log(response.data.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
