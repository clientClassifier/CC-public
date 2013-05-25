    $(document).ready(function () {
      var socket = io.connect();



      $('.isMoney').currency({
         decimals: 0
      });

      $('.isMoney2').currency({
         decimals: 2
      });


      $('#W2').bind('change',updateDocuments);
      $('#taxes').bind('change',updateDocuments);
      $('#payStub').bind('change',updateDocuments);
      $('#bankStatements').bind('change',updateDocuments);
      $('#prequal').bind('change',updateDocuments);


      $('#driversLicense').bind('change',updateDocuments);
      $('#socialSecurityCard').bind('change',updateDocuments);
      $('#application').bind('change',updateDocuments);
      $('#submissionForm').bind('change',updateDocuments);
      $('#signed').bind('change',updateDocuments);
      $('#preApproved').bind('change',updateDocuments);


      // // $('#prequal').bind('change',updateDocuments);
      // $('#showHouses').bind('change',updateDocuments);
      // $('#madeOffer').bind('change',updateDocuments);
      // $('#offerStatus').bind('change',updateDocuments);
      // $('#appraisal').bind('change',updateDocuments);
      // $('#escrow').bind('change',updateDocuments);
      // $('#closed').bind('change',updateDocuments);

      $('#credit').bind('change', updateDocuments);
      $('#updatedDocs').bind('change',updateDocuments);
      $('#conditions').bind('change',updateDocuments);
      $('#subOfLoan').bind('change',updateDocuments);
      $('#appraisal').bind('change',updateDocuments);
      $('#approved').bind('change',updateDocuments);
      $('#priorToDocs').bind('change',updateDocuments);
      $('#PTFconditions').bind('change',updateDocuments);
      $('#funding').bind('change',updateDocuments);




      function updateDocuments(){
        // console.log($(this).val() + ' ids ' + $(this).is(':checked'));
        var userInfo = urlData();
        var agentEmail  = $('#agentEmail').text();
        // socket.emit('updateDocuments', {checkbox: $(this).val(), state: $(this).is(':checked'), userId: userInfo.userId, clientId:userInfo.clientId, agentEmail: agentEmail});
        socket.emit('updateDocuments', {checkbox: $(this).val(), state: $(this).is(':checked'), userId: userInfo.userId, clientId:userInfo.clientId, userType: 'loanOfficer'});
      }//end of updateDocuments

      function urlData(){
        var locationObj = window.location.href;
        // console.log('locationObj = ' + locationObj);
        var spliturl = locationObj.split('/');
        // console.log('client = ' + spliturl[6]);
        // console.log('agent = ' + spliturl[4]);
        var data = {userId:  spliturl[4], clientId:  spliturl[6]};
        return data;
      }//end of urlData



      $('#taxes').prop("checked", inittaxes);
      $('#W2').prop("checked", initW2);
      $('#payStub').prop("checked", initpayStub);
      $('#bankStatements').prop("checked", initbankStatements);
      $('#prequal').prop("checked", initprequal);

      $('#driversLicense').prop("checked", initdriversLicense);
      $('#socialSecurityCard').prop("checked", initsocialSecurityCard);
      $('#application').prop("checked", initapplication);
      $('#submissionForm').prop("checked", initsubmissionForm);
      $('#signed').prop("checked", initsigned);
      $('#preApproved').prop("checked", initpreApproved);


      $('#prequalAgent').prop("checked", initprequalAgent);
      $('#showHouses').prop("checked", initshowHouses);
      $('#madeOffer').prop("checked", initmadeOffer);
      $('#offerStatus').prop("checked", initofferStatus);
      $('#appraisal').prop("checked", initappraisal);
      $('#escrow').prop("checked", initescrow);
      $('#EMD').prop("checked", initEMD);
      // $('#closed').prop("checked", initclosed);

      $('#prelim').prop("checked", initprelim);
      $('#escrowInstruction').prop("checked", initescrowInstruction);
      $('#reDisclosures').prop("checked", initreDisclosures);
      $('#homeInspections').prop("checked", inithomeInspections);
      $('#NTP').prop("checked", initNTP);
      $('#FWT').prop("checked", initFWT);

      $('#credit').prop("checked", initcredit);
      $('#updatedDocs').prop("checked", initupdatedDocs);
      $('#conditions').prop("checked", initconditions);
      $('#subOfLoan').prop("checked", initsubOfLoan);
      // $('#appraisal').prop("checked", initappraisal);
      $('#approved').prop("checked", initapproved);
      $('#priorToDocs').prop("checked", initpriorToDocs);
      $('#PTFconditions').prop("checked", initPTFconditions);
      $('#funding').prop("checked", initfunding);



        $('#btnSendEmailAgent').bind('click', function(){
        var textos=$('textarea[name="messageLoanOfficer"]');
        var instructions=[];
         for(var i=0;i<10;i++) {
           instructions[i]=textos[i+1].value;
        }
        var userInfo = urlData();
        var data={instructions:instructions,emailAgent:($('#agentEmail').text()),userId: userInfo.userId, clientId:userInfo.clientId,nameClient:($('#nameClient').text()),nameLO:($('#userNameFL').text())};


        socket.emit('sendEmailAgent', data);
         // socket.emit('sendEmailAgent',data,function (status){
         //    if(status){
         //      $('#btnSendEmailAgent').removeClass('btn-primary');
         //      $('#btnSendEmailAgent').addClass('btn-inverse');
         //      $("#btnSendEmailAgent").attr("disabled", "disabled");
         //      // $("input[type=submit]").removeAttr("disabled");
         //      console.log('se mando correctamente');
         //    }else{
         //      console.log('Ocurrio un error');
         //    }
         //  });
        });//end of $('#btnSendEmailAgent').bind('click')

        socket.on('sendEmailAgentDisableButton', function(status){
            if(status){
              $('#btnSendEmailAgent').removeClass('btn-primary');
              $('#btnSendEmailAgent').addClass('btn-inverse');
              $("#btnSendEmailAgent").attr("disabled", "disabled");
              // $("input[type=submit]").removeAttr("disabled");
              // console.log('se mando correctamente');
            }else{
              console.log('Socket: sendEmailAgentDisableButton: status was not true');
            }
        });//end of socket.on.sendEmailAgentDisableButton

      //for communications page
      $('#messageButton').bind('click', function(){
        // console.log('clicked message button');
        // console.log('message box contained = ' + $('#theMessage').val());
        var now = new Date();
        var testDate = $.format.date(now, "MMM-dd-yy hh:MMa:");
        var loanOfficerName = $('#loanOfficerName').val()
        // console.log('testDate = ' + testDate);
        var newhtml = "<div class='alert alert-success alert-block'><div class='row'><div class='span2'><p><strong>" +loanOfficerName+":</strong><br>"+ testDate +"</br></p></div><div class='span5'><p>" + $('#theMessage').val() + "</p></div></div></div>";
        $('#allMessages').prepend(newhtml);
        var userInfo = urlData();
        socket.emit('updateCommunication', {message: $('#theMessage').val(), userId: userInfo.userId, clientId:userInfo.clientId, userType: 'loanOfficer' });
        $('#theMessage').val('');
      });//end of messageButton bind




    //for instructions page
      $('.instructionButton').bind('click', function(){

        if($(this).closest('.span8').find('.message').val() != ''){
          //console.log('message instruction = ' + $(this).closest('.span8').find('.message').val());
          $(this).closest('.span8').find('.messageStatus').text('Instruction: Sent to server');
          
          var step = $(this).closest('.alert').find('h4').text().substr(5,1);
          // $('.icId'+step).prop("checked", initinstructCompleted[i]);
          var userInfo = urlData();
          socket.emit('saveLoanOfficerInstruction', {instruction: $(this).closest('.span8').find('.message').val(), step:  step, userId: userInfo.userId, clientId:userInfo.clientId });
        }
        else{
          $(this).closest('.span8').find('.messageStatus').text('Instruction: No instruction');
        }
      });//end of instructionButton




      socket.on('confirmSavedInstruction', function(step){
        $('.mId'+step).text('Instruction: Saved');
        var nextstep = parseInt(step)+1;
        //console.log('going to change text area with class  = taId'+ nextstep);
        $('.taId'+ nextstep).prop('disabled', false).focus();
        $('.ibId'+ nextstep).prop('disabled', false); //undisable enter button
        $('.icId'+ nextstep).prop('disabled', false); // undisabled completd checkbox
      });// end confirmSavedInstruction


      socket.on('denyConfirmSavedInstruction', function(step){
        // console.log('confirm instruction was denied')
        $('.mId'+step).text('Instruction: Not saved because agent has removed client');
      })

      socket.on('denyCommunication', function(err){
        var now = new Date();
        var testDate = $.format.date(now, "MMM-dd-yy hh:MMa:");
        // console.log('testDate = ' + testDate);
        var newhtml = "<div class='alert alert-error alert-block'><strong>" + testDate +"</strong> " + err + "</div>";
        $('#allMessages').prepend(newhtml);
      });

      socket.on('denyDocumentChange', function(data){
        if(data.state == true){
          $('#'+data.checkbox).prop("checked", false);
        }
        else{
          $('#'+data.checkbox).prop("checked", true);
        }
      });


      $('.instructionCompleted').bind('change',function(){
        var inputdata = $(this).closest('.alert').find('.message').val();
        // var step = $(this).closest('.alert').find('h4').text().substr(5,1);
        var userInfo = urlData();
        socket.emit('loanOfficerChangedCompleted', {instructionData: inputdata, checkbox: $(this).val(), state: $(this).is(':checked'),  userId: userInfo.userId, clientId:userInfo.clientId})
      })

      socket.on('comfirmCompleted', function(data){
        if(data.state === true){
          $('.mId'+data.checkbox).text('Instruction: Completed');
          $('.icId'+data.checkbox).prop("checked", true);
        }//end of data.state = true if
        else{
          $('.mId'+data.checkbox).text('Instruction: Saved');

          $('.icId'+data.checkbox).prop("checked", false);
        }//end of data.state = true else
      });//end of socket.on('comfirmCompleted')


      socket.on('denyComfirmCompleted', function(data, error){  
        $('.mId'+data.checkbox).text(error);
        if(data.state === true){ //request was to change to true. since taht was denied, return to original settings
          $('.icId'+data.checkbox).prop("checked", false);
        }//end of data.state = true if
        else{
          $('.icId'+data.checkbox).prop("checked", true);
        }//end of data.state = true else      
      })



      function fillInstructions(initinstructions){
        initinstructions.reverse();
        initinstructCompleted.reverse();
        for(var i = 0; i < initinstructions.length;i++){
          $('.taId'+(i+1)).val(initinstructions[i]);
          //console.log('is completed = ' +initinstructCompleted[i]);
          if(initinstructCompleted[i] == 'true'){ //if complted mId has different states
            //console.log('TRUE: i+1 = ' + parseInt(i+1));
            // $('.icId'+(i+1)).prop("checked", initinstructCompleted[i]);
            $('.mId'+(i+1)).text('Instruction: Completed');
          }
          else{
            //console.log('FALSE: i+1 = ' + parseInt(i+1));
            // $('.icId'+(i+1)).prop("checked", initinstructCompleted[i]);
            $('.mId'+(i+1)).text('Instruction: Saved');
          }
        }//end of for loop
      }//end of fillInstructions



      fillInstructions(initinstructions);

      $('#assignLoanOfficer').on('show', function (event) {
      var client = $(this).data('modal').options.clientid;
      var user = $(this).data('modal').options.userid;
      $('.client').text('clientId = ' + client)
      });



      $('.reduceDecimal').each(function(){
        $(this).text(parseFloat($(this).text()).toFixed(2));
      });//end of reduceDecimal

      $('input.numeric').change(function(){ //gives numbers their commas
        var num = $(this).val().match(/[0-9,]*/g)[0];
        var decimalNum = $(this).val().match(/[.][0-9]*/) || "";
        //- console.log(num);
        //- console.log(decimalNum);
        if(num) {
        var wholeNum = num.match(/[0-9]/g).reverse().join("").match(/[0-9]{1,3}/g).join(",").match(/./g).reverse().join("");
        //- console.log(wholeNum);
        var resultNum = wholeNum + decimalNum;
        $(this).val(resultNum);
        }
        else{
        $(this).val(num);
        }
      });














  // });//end of document ready




//below are functions strickly related to the calculator





      socket.on('ReturnMonthlyPayment', function(results){
        // $('#PP').prop('value', results.inputData.housePrice);
        // $('#EP').prop('value', results.inputData.downPaymentPercent);
        // $('#IR').prop('value', results.RIR);
        $('#LA').text(results.LA).currency({decimals: 2});
        $('#LP').text(results.LP + '%');
        $('#DP').text(results.inputData.downPayment).currency({decimals: 2});
        $('#MP').text(results.MP).currency({decimals: 2});
        $('#MCP').trigger('change');
        // console.log('LA = ' + $('#LA').text())
        // console.log('LA = ' + $('#LA').text())
        // console.log('LP = ' + $('#LP').text())
        // console.log('DP = ' + $('#DP').text())
        // console.log('MP = ' + $('#MP').text())

        //console.log('monthly payment = ' + $('#MP').text());

        //update the client tab information
        var twoFive = onlynums($('#PP').val())*(0.025);
        var threeEven = onlynums($('#PP').val())*(0.03);
        $('#twoFive').text(twoFive).currency({decimals: 0});
        $('#threeEven').text(threeEven).currency({decimals: 0});
        $('#CPP').text('$' + $('#PP').val()).currency({decimals: 0});
        $('#CLA').text($('#LA').text());
        $('#CIR').text($('#IR').val()+'%');
        $('#CDP').text($('#DP').text());



        // console.log('will call income needed next')
        // updateIncNeed();

        });// end ReturnMonthlyPayment





      socket.on('ReturnIncomeNeeded', function(result){
        $('#IN').text(result.incneeded).currency();
        $('#PIDTI').text(result.inc47.toFixed(2)).currency();
        $('#DTIFront').text(result.frontDTI.toFixed(2));
        $('#DTIBack').text(result.backDTI.toFixed(2));
        // console.log('loanPaperGrade = ' + result.loanPaperGrade)
        $('#loanPaperGrade').text(result.loanPaperGrade);
        updateCoborrowerIncomeNeeded(result.incneeded, result.inputData.needCoborrower);
        updateFrontBackGrade(result.grade); 

        //Client page update
        var TMI = parseFloat(onlynums($('#BR1').val())) + parseFloat(onlynums($('#BR2').val())) + parseFloat(onlynums($('#BR3').val()));
        $('#CTMI').text(TMI).currency({decimals: 0});
        $('#infoGrade').text(result.grade);
        $('#infoNCB').text(result.inputData.needCoborrower);

      });//end of socket 'ReturnIncomeNeeded'


      $('a[data-toggle="tab"]').on('shown', function (e) {
        var thisTab = $(this).attr("href");
        var CNExists = $('.commAlertExists').val();
        // console.log('CNExists = ' + CNExists);
        if(thisTab == '#communication' && CNExists != 'false'){
          // console.log('clicked communication tab, hence remove the notification span');
          $('#communicationNotification').remove();
          $('.commAlertExists').val('false');

          var userInfo = urlData(); //grab this users id, and client id
          socket.emit('removeCommunicationNotification',{ userId: userInfo.userId, clientId:userInfo.clientId, userType: 'loanOfficer'});
        }//end of if communication tab
        else{
          // console.log('Tab opend = ' + thisTab);
        }//end of not communiction tab
      });//end of identify which tab was clicked



      $('#PP').bind('change',updateChangeMonthly);//end o #PP change
      $('#EP').bind('change',function(){
        // $('#EP').replaceEmpty(3.5);
        if($('#EP').val() < parseFloat(3.5)){
          $('#EP').val(3.5);
        }
        else if($('#EP').val() > parseFloat(100.0)){
          $('#EP').val(100);
        }
        // console.log('changed down payment percent')
        updateChangeMonthly();
      });//end #EP
      $('#IR').bind('change',function(){
        // var LA = onlynums($('#LA').text());
        // $('#IR').replaceEmpty(5);
        if($('#IR').val() < parseFloat(2)){
          $('#IR').val(2);
        }
        else if($('#IR').val() > parseFloat(5)){
          $('#IR').val(5);
        }
        // console.log('changed interest rate')
        updateChangeMonthly();
      });//end interest rate bind


      $('#MP').bind('change',updateIncNeed);
      $('#MCP').bind('change',updateIncNeed);
      $('#RI').bind('change',updateIncNeed);
      $('#BR1').bind('change',updateIncNeed);
      $('#BR2').bind('change',updateIncNeed);
      $('#BR3').bind('change',updateIncNeed);









      // initializtions for default view
      $('#NCB').text(initNCB);
      $('#PP').prop('value', initPP);
      $('#LP').text(initLP +'%');
      $('#LA').text(initLA).currency({decimals: 0});
      $('#DP').text(initDP).currency({decimals: 2});
      $('#MP').text(initMP).currency({decimals: 2});
      $('#EP').prop('value', initEP);
      $('#RI').prop('value', initRI);
      $('#MCP').prop('value', initMCP);
      $('#BR1').prop('value', initBR1);
      $('#BR2').prop('value', initBR2);
      $('#BR3').prop('value', initBR3);
      $('#IR').prop('value', initIR);
      $('#PIDTI').text(initinc47).currency({decimals: 2}).css({"color":"#0000CD"})
      $('#DTIFront').text(initfrontDTI.toFixed(2));
      $('#DTIBack').text(initbackDTI.toFixed(2));
      $('#IN').text(initIN).currency({decimals: 2});
      $('#ClientGrade').text(initgrade);
      $('#loanPaperGrade').text(initloanPaperGrade);



    updateCoborrowerIncomeNeeded(initIN, initNCB);
    updateFrontBackGrade(initgrade); 
    function updateFrontBackGrade(grade){
        if(grade == '' || grade =='undefined'){
          $('#NCB').empty();
          $('#IN').empty();
          $('#ClientGrade').text('');
          $('#DTIBack').empty();
          $('#DTIFront').empty();
        }
        else if(grade == 'A+'){
          $('#DTIBack').css({"color": "green"});
          $('#DTIFront').css({"color": "green"});
          $('#ClientGrade').text(grade);
          $('#ClientGrade').css({"color":"green"});
          $('#A1').html('');
          $('#A2').html('');
          $('#A3').html('');
          $('#A4').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-success" href="#" >Show Houses</button>');
          $('#A3').html('<div class="alert alert-info"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "We help you with the closing costs"</div>');
          $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> You have a super client! </p></div>');
        }
        else if(grade == 'A'){
          $('#DTIBack').css({"color": "#FF7F24"});
          $('#DTIFront').css({"color": "#FF7F24"});
          $('#ClientGrade').text(grade);
          $('#ClientGrade').css({"color":"green"});
          // $('#STATUS').text('APPROVED! GET PREQUAL');
          $('#STATUS').css({"color": "green"});
          $('#A1').html('');
          $('#A2').html('');
          $('#A4').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-success" href="#" >Show Houses</button>');
          $('#A3').html('<div class="alert alert-info"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "We help you with the closing costs"</div>');
          $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> You have a super client! </p></div>');
        }
        else if(grade == 'B'){
          $('#DTIBack').css({"color": "#FF7F24"});
          $('#DTIFront').css({"color": "#FF7F24"});
          $('#ClientGrade').text(grade);
          $('#ClientGrade').css({"color":"#FF7F24"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "#FF7F24"})
          $('#A5').html('');
          //- $('#A1').html('');
          //- $('#A2').html('');
          $('#A3').html('<div class="alert alert-info"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "We can help you with the closing costs"</div>');
          $('#A2').html('<div class="alert"> Reduce Maximum House Price to get A+ </div>');
          $('#A4').html('<div class="alert"> Increase Income by recommnded amount </div>');
          $('#A1').html('<div class="alert alert-info"> Reaching limits of purchasing power </div>');
          $('#A5').html('<div class="alert"> Can you pay down debt? </div>');
          // $('#A6').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-warning" href="#" data-toggle="modal"  data-target="#CallGilmerModal" >Call XAVIER</button>');
          //- $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> you have been aproved! Get your prequal! </p></div>');
        }
        else if(grade == 'C'){
          $('#DTIBack').css({"color": "red"});
          $('#DTIFront').css({"color": "red"});
          $('#ClientGrade').text(grade);
          $('#ClientGrade').css({"color":"red"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "red"})
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-warning" href="#" data-toggle="modal"  data-target="#CallGilmerModal">Call XAVIER</button>');
          $('#A3').html('');
          $('#A5').html('');
          $('#A3').html('<div class="alert alert-info"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "We are the only ones who can moved this client forward!"</div>');
          $('#A2').html('<div class="alert"> Reduce Maximum House Price to get A+ </div>');
          $('#A4').html('<div class="alert"> Increase Income by recommnded amount </div>');
          // $('#A1').html('<div class="alert alert-info"> Reaching limits of purchasing power </div>');
          $('#A5').html('<div class="alert"> Can you pay down debt? </div>');

        }
        else{
          $('#DTIBack').css({"color": "darkred"});
          $('#DTIFront').css({"color": "darkred"});
          $('#ClientGrade').text(grade);
          $('#ClientGrade').css({"color":"darkred"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "darkred"})
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-danger" href="#" data-toggle="modal"  data-target="#CallGilmerModal">Call XAVIER</button>');
          $('#A3').html('');
          $('#A5').html('');
          $('#A1').html('');
          $('#A3').html('<div class="alert alert-info"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "Lets work together to make your prospect into a real buyer"</div>');
          $('#A1').html('<div class="alert alert-error"> Reduce Maximum House Price to get A+ </div>');
          $('#A2').html('<div class="alert alert-error"> Increase Income by recommnded amount </div>');
          $('#A4').html('<div class="alert alert-error"> Can you pay down debt? </div>');
        }//end of if else chain
    }//end of updateFrontBackGrade





    function updateCoborrowerIncomeNeeded(incomeNeeded, Coborrower){
        if(parseFloat(incomeNeeded) <= parseFloat('300')){
          $('#NCB').text(Coborrower).css({"color": "green"});
          $('#IN').css({"color":"green"});
        }
        else if(parseFloat(incomeNeeded) > parseFloat('300') && parseFloat(incomeNeeded) <= parseFloat('700')) {
          $('#NCB').text(Coborrower).css({"color": "#FF7F24"});
          $('#IN').css({"color":'#FF7F24'});
        }
        else{
          $('#NCB').text(Coborrower).css({"color": "red"});
          $('#IN').css({"color":"red"});
        }

    }//end of updateCoborrowerIncomeNeeded




      $('input.numeric').change(function(){ //gives numbers their commas
        var num = $(this).val().match(/[0-9,]*/g)[0];
        var decimalNum = $(this).val().match(/[.][0-9]*/) || "";
        //- console.log(num);
        //- console.log(decimalNum);
        if(num) {
        var wholeNum = num.match(/[0-9]/g).reverse().join("").match(/[0-9]{1,3}/g).join(",").match(/./g).reverse().join("");
        //- console.log(wholeNum);
        var resultNum = wholeNum + decimalNum;
        $(this).val(resultNum);
        }
        else{
        $(this).val(num);
        }
      });



      $('#HourPay').keyup(function(){
        $('#BWP').prop('value', '');
        $('#BWPtext').empty();
        $('#YP').prop('value', '');
        $('#YPtext ').empty();
        var HP = parseFloat(onlynums($('#HourPay').val()));
        var MonPay = (HP*40*52)/12;
        $('#HourPaytext').text(' ' + MonPay.toFixed(2));
        $('#HourPaytext').currency();
      });
      $('#BWP').keyup(function(){
        $('#HourPay').prop('value', '');
        $('#HourPaytext').empty();
        $('#YP').prop('value', '');
        $('#YPtext ').empty();
        var BWP = parseFloat(onlynums($('#BWP').val()));
        var MonPay = (BWP*26)/12;
        $('#BWPtext').text(' ' + MonPay.toFixed(2));
        $('#BWPtext').currency();
      });
      $('#YP').keyup(function(){
        $('#HourPay').prop('value', '');
        $('#HourPaytext').empty();
        $('#BWP').prop('value', '');
        $('#BWPtext').empty();
        var YP = parseFloat(onlynums($('#YP').val()));
        var MonPay = (YP)/12;
        $('#YPtext ').text(' ' + MonPay.toFixed(2));
        $('#YPtext ').currency();
      });

      $('#INC1').click(function(){
        // $('#INC1').replaceEmpty(0);
        var incomefound = GrabCalculatedValue();
        $('#BR1').prop('value', incomefound);
        $('#BR1').trigger('change');
      });
      $('#INC2').click(function(){
        // $('#INC2').replaceEmpty(0);
        var incomefound = GrabCalculatedValue();
        $('#BR2').prop('value', incomefound);
        $('#BR2').trigger('change');
      });
      $('#INC3').click(function(){
        // $('#INC3').replaceEmpty(0);
        var incomefound = GrabCalculatedValue();
        $('#BR3').prop('value', incomefound);
        $('#BR3').trigger('change');
      });

      function GrabCalculatedValue(){
        //- console.log('hp1 = ' + onlynums($('#HourPaytext').text()))
        //- console.log('bwp1 = ' + onlynums($('#BWPtext').text()))
        //- console.log('yp1 = ' + onlynums($('#YPtext').text()))

        // $('#YPtext').replaceEmpty(0);
        // $('#BWPtext').replaceEmpty(0);
        // $('#HourPaytext').replaceEmpty(0);

        if($('#YPtext').text() != ''){
          //- console.log('return YP')
          return onlynums($('#YPtext').text());
        }
        else if($('#BWPtext').text() != ''){
          //- console.log('return BWP ')
          return onlynums($('#BWPtext').text());
        }
        else if($('#HourPaytext').text() != ''){
          //- console.log('return HP ')
          return onlynums($('#HourPaytext').text());
        }
      }


      var updateIncomeCalls = 0;

      function updateIncNeed(){
        // console.log('calling updateIncNeed');
        // console.log('updateIncNeeded called = ' + updateIncomeCalls);
        updateIncomeCalls++;
        //- console.log('inc needed this value = ' + $(this).val());
       
        // console.log('input called = ' + $(this).val());
        // $(this).replaceEmpty(0);
        var MP = $('#MP').text();
        //- console.log("MP before = " + MP)
        //- MP = MP.substring(1);
        //- console.log("MP after = " + onlynums(MP))
        var MCP = onlynums($('#MCP').val());
        var TMI = parseFloat(onlynums($('#BR1').val())) + parseFloat(onlynums($('#BR2').val())) + parseFloat(onlynums($('#BR3').val()));
        var RI = parseFloat(onlynums($('#RI').val()));
        var inputData = grabAllData();
        var userInfo = urlData();
        socket.emit('ChangeIncomeNeeded',{MP: onlynums(MP), MCP: MCP, TMI: TMI, RI: RI, inputData: inputData, agentId: userInfo.agentId, clientId:userInfo.clientId , userType: $('.userType').val() });
      }//end of updateIncNeed

      function updateChangeMonthly(){
        //- console.log('inc needed this value = ' + $(this).val());
        // $(this).replaceEmpty(0);


        var PP = $('#PP').text();
        var LA = $('#LA').text();
        var IR = $('#IR').val();
        var LP = parseFloat($('#LP').text());

        var userInfo = urlData();
        var inputData = grabAllData();

        // console.log('userType = ' + $('.userType').val())

        socket.emit('ChangeMonthly',{
          LA: onlynums(LA), IR: onlynums(IR), LP: LP, agentId: userInfo.agentId, clientId:userInfo.clientId,
            inputData: inputData, userType: $('.userType').val()
          });
      }//end updateChangeMonthly







      function onlynums(n){
        return n.replace(/[,A-Za-z$-]/g, '');
      }

      $.fn.replaceEmpty = function(n){
        //- console.log('was this called properly? val = ' + $(this).val())
        if($(this).val().length === 0 ){
          //- console.log('value is empty hence will be replaced with = ' + n)
          $(this).val(n);
          $(this).trigger('change');
        }
      };//end of repalceEmpty



      function grabAllData(){ //called before going to ther server
        var PP = onlynums($('#PP').val());
        var MP = onlynums($('#MP').text());
        var DP = onlynums($('#DP').text());
        var DPP = onlynums($('#EP').val());
        var MCP = onlynums($('#MCP').val());
        var RI = parseFloat(onlynums($('#RI').val()));
        var BR1 = onlynums($('#BR1').val());
        var BR2 = onlynums($('#BR2').val());
        var BR3 = onlynums($('#BR3').val());
        var NCB = $('#NCB').text();
        // console.log('coborrower status = ' + NCB);

        var agentEmail = $('#agentEmail').text();

        var Grade = $('#ClientGrade').text();
        var loanPaperGrade = $('#loanPaperGrade').text();
        // console.log('client grade = ' + Grade);
        // console.log('PP = ' +  PP);
        // console.log('MP = ' + MP);
        // console.log('downPaymentPercent = ' + DPP);
        // console.log('DP = ' + DP);
        // console.log('MCP = ' + MCP);
        // console.log('RI = ' + RI);
        // console.log('BR1 = ' + BR1);
        // console.log('BR2 = ' + BR2);
        // console.log('BR3 = ' + BR3);
        var inputdata = { housePrice: PP, downPayment: DP ,monthlyDebtPayments: MCP, rentalIncome: RI, 
            downPaymentPercent: DPP, monthlyPayment: MP, grade: Grade,
            borrower1: BR1, borrower2 : BR2, borrower3: BR3, needCoborrower: NCB, loanPaperGrade: loanPaperGrade, agentEmail : agentEmail
        };
        return inputdata;
      }//end of grabAllData


      // function urlData(){
      //   var locationObj = window.location.href;
      //   // console.log('locationObj = ' + locationObj);
      //   var spliturl = locationObj.split('/');
      //   console.log('client = ' + spliturl[6]);
      //   console.log('user = ' + spliturl[4]);
      //   var data = {agentId:  spliturl[4], clientId:  spliturl[6]};
      //   return data;
      // }




    })//end of second documentready