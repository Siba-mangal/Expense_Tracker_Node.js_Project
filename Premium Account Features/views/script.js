const message = document.getElementById("email-message");

function signUp(event) {
  event.preventDefault();
  const name = event.target.Name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  const myObj = {
    name,
    email,
    password,
  };
  // console.log(myObj);
  axios
    .post("http://localhost:3000/user/signup", myObj)
    .then((response) => {
      if (response.status === 201) {
        message.removeAttribute("hidden");
        message.innerHTML =
          '<span class="badge bg-success">Email is available</span>';
      }
    })
    .catch((error) => console.log(error));

  event.target.Name.value = "";
  event.target.email.value = "";
  event.target.password.value = "";
  window.location.href = "./login.html";
}
