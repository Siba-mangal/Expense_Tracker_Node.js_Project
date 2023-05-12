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
      if (response.status === 201) {
        alert(response.data.msg);
      }
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
