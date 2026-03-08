document.getElementById('login-btn')
  .addEventListener("click",function(){
    const userNameInput = document.getElementById('input-username');
    const userName = userNameInput.value;
    console.log(userName);
    
    const userPasswordInput = document.getElementById('input-password');
    const userPassword = userPasswordInput.value;
    console.log(userPassword);

    if(userName == 'admin' && userPassword == 'admin123'){
      alert('Sign In Successful');

      window.location.assign("/homepage.html")
    }else{
      alert("Sign In Failed");
      return;
    }
  })