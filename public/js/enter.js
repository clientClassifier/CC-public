$(document).ready(function () {

  $('.onlyCharacters').keyup(function() {
        $(this).val($(this).val().replace(/[^A-Za-z]/g,''));
  });
  $('.onlyCharactersWithSpace').keyup(function() {
        $(this).val($(this).val().replace(/[^A-Za-z0-9 ]/g,''));
  });


  $('#registerAgent').validate({
    rules: {
      firstName: {
        required: true
      },
      lastName: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      confirmEmail: {
        required: true,
        email: true,
        equalTo: '#email'
      },
      password: {
        minlength: 9,
        required: true
      },
      cellPhone: {
        required: true
      },
      companyName: {
        required: true
      },
      companyPhone: {
        required: true
      },
      TOS :{
        required: true
      }
    },
    highlight: function(label) {
      $(label)
        .closest('.control-group').addClass('error');
    },
    success: function(label) {
      label
        .text('OK!').addClass('valid')
        .closest('.control-group').addClass('success');
    },
    messages: {
      firstName:{
        required: "Please enter your first name"
      },
      lastName:{
        required: "Please enter your last name"
      },
      email:{
        required: "Please enter your email"
      },
      confirmEmail:{
        equalTo: "Enter the same email address",
        required: "Please confirm your email address"
      },
      password:{
        minlength: "Password must be at least 9 characters long",
        required: "Please enter your password"
      },
      cellPhone: {
        required: "Please enter your cell phone number"
      },
      companyName: {
        required: "Please enter the name of the company you work for"
      },
      companyPhone: {
        required: "Please enter the company phone number"
      },
      TOS : {
        required: "You must accept the Terms of service"
      }
    }
  });



// function getObjectClass(obj){
//    if (typeof obj != "object" || obj === null) return false;
//    else return /(\w+)\(/.exec(obj.constructor.toString())[1];}



  $('#register_submit').click(function() {
    $('#registerAgent').submit();
  });
  $('#login_submit').click(function() {
    $('#userLogin').submit();
  });

  $('#userLogin').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        minlength: 9, //temp because i dont want to enter a whole password
        required: true
      }
    },
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      label
        .text('OK!').addClass('valid')
        .closest('.control-group').addClass('success');
    },
    messages: {
      email: {
        required: "Please enter your email"
      },
      password: {
        minlength: "Password should be at least 9 characters long",
        required: "Please enter your password"
      }
    }
  });








 $('#registerAgentNOTMODAL').validate({
    rules: {
      firstName: {
        required: true
      },
      lastName: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      confirmEmail: {
        required: true,
        email: true,
        equalTo: '#email'
      },
      password: {
        minlength: 9,
        required: true
      },
      cellPhone: {
        required: true
      },
      companyName: {
        required: true
      },
      companyPhone: {
        required: true
      },
      TOS :{
        required: true
      }
    },
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      label
        .text('OK!').addClass('valid')
        .closest('.control-group').addClass('success');
    },
    messages: {
      firstName:{
        required: "Please enter your first name"
      },
      lastName:{
        required: "Please enter your last name"
      },
      email:{
        required: "Please enter your email"
      },
      confirmEmail:{
        equalTo: "Enter the same email address",
        required: "Please confirm your email address"
      },
      password:{
        required: "Please enter your password"
      },
      cellPhone: {
        required: "Please enter your cell phone number"
      },
      companyName: {
        required: "Please enter the name of the company you work for"
      },
      companyPhone: {
        required: "Please enter the company phone number"
      },
      TOS : {
        required: "You must accept the Terms of service"
      }
    }
  });




  $('#userLoginNOTMODAL').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        minlength: 1, //temp because i dont want to enter a whole password
        required: true
      }
    },
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      label
        .text('OK!').addClass('valid')
        .closest('.control-group').addClass('success');
    },
    messages: {
      email: {
        required: "Please enter your email"
      },
      password: {
        required: "Please enter your password"
      }
    }
  });





  enablePopovers();


  $('#logInModal').on('show', removePopovers);
  $('#logInModal').on('hide', enablePopovers);
  $('#registerModal').on('show', removePopovers);
  $('#registerModal').on('hide', enablePopovers);


  function removePopovers(){
      $('#debt').popover('hide')
      $('#income').popover('hide')
      $('#financialPicture').popover('hide')
  }

  function enablePopovers(){
      $('#debt').popover('show')
      $('#income').popover('show')
      $('#financialPicture').popover('show')
  }



  // $("#cellPhone").mask("(999) 999-9999");
  // $("#companyPhone").mask("(999) 999-9999");
  $(".isPhone").mask("(999) 999-9999");
  


});//end of document.ready