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

document.querySelector(".profile").addEventListener("click", function () {
  const del = document.querySelector(".download-btn");
  if (del.classList.contains("active")) {
    del.classList.remove("active");
  } else {
    del.classList.add("active");
  }
});

document.querySelector(".profile").addEventListener("click", function () {
  const led = document.querySelector(".leaderboard");
  if (led.classList.contains("active")) {
    led.classList.remove("active");
  } else {
    led.classList.add("active");
  }
});

// -------------------------------------
const tbody = document.querySelector("#expenses tbody");
const expenses = document.getElementById("expenses");

const selectElement = document.getElementById("rowPerPage");
console.log(selectElement.value);

selectElement.addEventListener("change", async () => {
  const selectedOption = selectElement.selectedOptions[0];
  console.log(`Selected option: ${selectedOption.value}`);
  const rowsize = selectedOption.value;
  localStorage.setItem("pagesize", rowsize);
  const token = localStorage.getItem("token");

  const pageno = localStorage.getItem("pageno");

  const expensedata = await axios.get(
    `http://localhost:3000/expense/get-expense?param1=${pageno}&param2=${rowsize}`,
    {
      headers: { Authorization: token },
    }
  );
  showPagination(
    expensedata.data.currentPage,
    expensedata.data.hasNextPage,
    expensedata.data.nextPage,
    expensedata.data.hasPreviousPage,
    expensedata.data.previousPage,
    expensedata.data.lastPage
  );
  tbody.innerHTML = "";
  localStorage.setItem("pagesize", expensedata.data.limit_per_page);
  for (let i = 0; i < expensedata.data.expenseData.length; i++) {
    console.log(expensedata.data.expenseData[i]);
    showListofRegisteredUser(expensedata.data.expenseData[i]);
  }
});

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
        console.log(response.data);
        showListofRegisteredUser(response.data);
        addOnScreen(obj, response.data.id);
      }
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

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const ispremiumuser = decodeToken.ispremiumuser;
  if (ispremiumuser) {
    showPremiumuserMessage();
    showLeaderboard();
  }
  //pagination
  const PageNo = 1;
  localStorage.setItem("pageno", PageNo);
  const pageSize = localStorage.getItem("pagesize") || 5;

  const expensedata = await axios.get(
    `http://localhost:3000/expense/get-expense?param1=${PageNo}&param2=${pageSize}`,
    {
      headers: { Authorization: token },
    }
  );

  localStorage.setItem("pagesize", expensedata.data.limit_per_page);
  if (expensedata.data.limit_per_page <= 0) {
    alert("No records found");
    document.getElementById("pagination").style.display = "none";
    selectElement.style.display = "none";
  } else {
    for (var i = 0; i < expensedata.data.expenseData.length; i++) {
      showListofRegisteredUser(expensedata.data.expenseData[i]);
    }
    showPagination(
      expensedata.data.currentPage,
      expensedata.data.hasNextPage,
      expensedata.data.nextPage,
      expensedata.data.hasPreviousPage,
      expensedata.data.previousPage,
      expensedata.data.lastPage
    );
  }
  document.getElementById("pagination").style.display = "block";
  selectElement.style.display = "block";
});

function showListofRegisteredUser(user) {
  const row = document.createElement("tr");
  row.id = user.id;

  const priceCell = document.createElement("td");
  priceCell.textContent = user.price;
  row.appendChild(priceCell);

  const productNameCell = document.createElement("td");
  productNameCell.textContent = user.productName;
  row.appendChild(productNameCell);

  const categoryCell = document.createElement("td");
  categoryCell.textContent = user.category;
  row.appendChild(categoryCell);

  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.style.width = "50px";
  deleteButton.style.fontSize = "10px";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", (event) => deleteUser(event, user.id));
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  tbody.appendChild(row);
  // tbody.innerHTML += row;
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
  console.log(expense);
  const elem = document.getElementById(expense.id);
  console.log(elem);
  elem.remove();
  // expenses.removeChild(elem);
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

    const learderboardElem = document.getElementById("head-board");

    if (learderboardElem.innerHTML === "") {
      learderboardElem.innerHTML += "<h1>Leader Board</h1>";
      learderboardElem.innerHTML +=
        "<tr><th>Name</th><th>Total Expenses</th></tr>";
    }

    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = "";
    userLeaderBoardArray.data.forEach((userDetails) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${userDetails.username}</td>
    <td>${userDetails.total_cost !== null ? userDetails.total_cost : 0}</td>
  `;
      leaderboardBody.appendChild(row);
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
const pagination = document.getElementById("pagination");

function showPagination(
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
) {
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", function (e) {
      e.preventDefault();
      getProducts(previousPage);
    });
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;

  btn1.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("pageno", currentPage);
    getProducts(currentPage);
  });

  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", function (e) {
      e.preventDefault();
      getProducts(nextPage);
    });

    pagination.appendChild(btn3);
  }
}

async function getProducts(page) {
  // var pageSize = 2;
  tbody.innerHTML = "";

  const token = localStorage.getItem("token");

  var pagesize = localStorage.getItem("pagesize") || 5;
  localStorage.setItem("pageno", page);
  const expensedata = await axios.get(
    `http://localhost:3000/expense/get-expense?param1=${page}&param2=${pagesize}`,
    {
      headers: { Authorization: token },
    }
  );
  console.log("getProducts", expensedata);
  for (let i = 0; i < expensedata.data.expenseData.length; i++) {
    showListofRegisteredUser(expensedata.data.expenseData[i]);
  }
  localStorage.setItem("pagesize", expensedata.data.limit_per_page);
  showPagination(
    expensedata.data.currentPage,
    expensedata.data.hasNextPage,
    expensedata.data.nextPage,
    expensedata.data.hasPreviousPage,
    expensedata.data.previousPage,
    expensedata.data.lastPage
  );
}

//adOnScreen

function addOnScreen(obj, UserId) {
  const numRows = tbody.rows.length;
  console.log("numRows", numRows);
  const pageno = parseInt(localStorage.getItem("pageno"));
  const pagesize = parseInt(localStorage.getItem("pagesize"));

  const hasNextPage = pagesize < pagesize * (pageno - 1) + numRows + 1;
  const nextPage = pageno + 1;
  const hasPreviousPage = pageno > 1;
  const previousPage = pageno - 1;
  const lastPage = Math.ceil((numRows + 1) / pagesize);

  showPagination(
    pageno,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
  );
}
