function signUp(e) {
  e.preventDefault();
  const name = e.target.Name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  if (password && password.length < 1) {
    alert("Please enter password greater than one character");
  }

  const myObj = {
    name,
    email,
    password,
  };
  axios
    .post("http://localhost:3000/user/signup", myObj)
    .then((response) => {
      if (response.status === 201) {
        document.getElementById("error").innerHTML = response.data.err;
      }
    })
    .catch((error) => console.log(error));

  e.target.Name.value = "";
  e.target.email.value = "";
  e.target.password.value = "";
  //   location.reload();
}
