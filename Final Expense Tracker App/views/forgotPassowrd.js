function resetPassword(e) {
  e.preventDefault();
  const emailId = e.target.email.value;
  axios.post("http://localhost:3000/password/forgotPassword", { emailId });
  e.target.email.value = "";
}
