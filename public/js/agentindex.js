$(document).ready(function () {


    $('.onlyCharacters').keyup(function() {
        $(this).val($(this).val().replace(/[^A-Za-z]/g,''))
  });

    
  $("#newClientForm").validate({
    rules: {
        firstName: {required: true},
        lastName: {required: true}
        // clientConfirm: {required: true}

    },
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
      // $('#fName').addClass('control-group error')
      // console.log('highlight!!!');
    },
    success: function(label) {
      // console.log('button should change!!!');
      label
        .text('OK!').addClass('valid')
        .closest('.control-group').addClass('success');
      // $('#createNewClient').disabled = false;

    },
    messages: {
        firstName:{
          required: "Enter first name"
        },
        lastName:{
          required: "Enter last name"
        }
        // clientConfirm: {
        //   required: "Must receive client confirmation"
        // }
      }
  });//end of form validation rules



  $('.isMoney').currency({
         decimals: 0
    });

});//end of document.ready

