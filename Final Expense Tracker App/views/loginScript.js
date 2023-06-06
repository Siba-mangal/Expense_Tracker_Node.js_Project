function login(e) {
  e.preventDefault();
  const Email = e.target.email.value;
  const Password = e.target.password.value;
  if (Email == "" || Password == "") {
    message.removeAttribute("hidden");
    message.innerHTML =
      '<span class="badge bg-success">Please enter all field</span>';
  }
  myObj = {
    Email,
    Password,
  };

  axios
    .post("http://localhost:3000/user/login", myObj)
    .then((response) => {
      alert(response.data.msg);
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
      window.location.href = "./expense.html";
    })
    .catch((err) => {
      if (err.response.status === 401) {
        alert(err.response.data.msg);
        console.log(err.response.data.msg);
      }

      if (err.response.status === 404) {
        alert(err.response.data.msg);
        console.log(err.response.data.msg);
      }
      console.log(err);
    });

  e.target.email.value = "";
  e.target.password.value = "";
}

document.getElementById("forgotPassword").onclick = async function (e) {
  SetTitle("Forgot Password");
};
