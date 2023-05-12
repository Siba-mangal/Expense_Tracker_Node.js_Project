const wrapper = document.querySelector(".wrapper");
const signupHeader = document.querySelector(".signup header");
const loginHeader = document.querySelector(".login header");

const message = document.getElementById("email-message");

loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

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
        message.removeAttribute("hidden");
        message.innerHTML =
          '<span class="badge bg-success">Email is available</span>';
      }
    })
    .catch((error) => console.log(error));

  e.target.Name.value = "";
  e.target.email.value = "";
  e.target.password.value = "";
}

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
        console.log("login successful");
        console.log(response);
        message.removeAttribute("hidden");
        message.innerHTML = `<span class="badge bg-success">${response.data.msg}</span>`;
      }
      // else if (response.status === 202) {
      //   console.log("login failed");
      // }
    })
    .catch((err) => {
      console.log(err.message);
    });

  e.target.email.value = "";
  e.target.password.value = "";
}
