    $(document).ready(function () {
      var socket = io.connect();
      
      $('#PP').bind('change',function(){
        $('#PP').replaceEmpty(250000);
        // $('#LA').trigger('change');
        //  var PP = onlynums($('#PP').v al());



        updateChangeMonthly();




      });//end o #PP change


      // $('#LA').bind('change',function(){
      //   var LP = parseFloat($('#LP').text());
      //   var PP = onlynums($('#PP').val());
      //   var LA = (LP*PP)/100;
      //   var DP = PP - LA;

      //   $('#LA').text(LA);
      //   $('#LA').currency({decimals: 0});
      //   $('#DP').trigger('change');
      //   // var IR = $('#IR').val();
      //   // var userInfo = urlData();
      //   // var inputData = grabAllData();

      //   updateChangeMonthly();
      // });//end of #LA 


      // $('#LP').bind('change',function(){
      //   var LP = parseFloat($('#LP').text());
      //   var EP = 100 - LP;
      //   $('#EP').prop('value', EP);
      //   $('#LA').trigger('change');
      // });//end #LP



      $('#EP').bind('change',function(){
        $('#EP').replaceEmpty(3.5);
        if($('#EP').val() < parseFloat(3.5)){
          $('#EP').val(3.5);
        }
        else if($('#EP').val() > parseFloat(100.0)){
          $('#EP').val(100);
        }

        // var EP = $('#EP').val();
        // var LP = 100 - EP;
        // $('#LP').text(LP + "%");
        // $('#LA').trigger('change');


        updateChangeMonthly();

      });//end #EP



      // $('#DP').bind('change',function(){ //this is not used at the momment
      //   var EP = $('#EP').val();
      //   var PP = $('#PP').val();
      //   var DP = (EP*onlynums(PP))/100;
      //   $('#DP').text(DP);
      //   $('#DP').currency({decimals: 2});
      // });//end #DP


      $('#IR').bind('change',function(){
        // var LA = onlynums($('#LA').text());
        $('#IR').replaceEmpty(5);
        if($('#IR').val() < parseFloat(2)){
          $('#IR').val(2);
        }
        else if($('#IR').val() > parseFloat(5)){
          $('#IR').val(5);
        }
        // var IR = $('#IR').val();
        // console.log('IR after = ' + $('#IR').val());
        //- LA = LA.substring(1);
        //- console.log("LA after removing everything ! = " + LA)
        //- console.log("LA no remove = " + LA);
        
        // var LP = parseFloat($('#LP').text());
        //- console.log("grabed LP = " + LP)
        // var LP = $('#LP').val();
        // var userinfo = urlData();
        // var inputData = grabAllData();


        updateChangeMonthly();
      });//end interest rate bind

      var changeMonthlyToServerIndex = 0;

      function updateChangeMonthly(){
        // console.log('inc needed this value = ' + $(this).val());
        // $(this).replaceEmpty(0);
        var PP = $('#PP').text();
        var LA = $('#LA').text();
        var IR = $('#IR').val();
        var LP = parseFloat($('#LP').text());

        var userInfo = urlData();
        var inputData = grabAllData();

        // console.log('userType = ' + $('.userType').val())

        // console.log('calling ChangeMonthly = ' + changeMonthlyToServerIndex);
        changeMonthlyToServerIndex++;
        socket.emit('ChangeMonthly',{
          LA: onlynums(LA), IR: onlynums(IR), LP: LP, agentId: userInfo.agentId, clientId:userInfo.clientId,
            inputData: inputData, userType: $('.userType').val()
          });
      }//end updateChangeMonthly


      $('#prequalAgent').bind('change',updateDocuments);
      $('#showHouses').bind('change',updateDocuments);
      $('#madeOffer').bind('change',updateDocuments);
      $('#offerStatus').bind('change',updateDocuments);
      $('#EMD').bind('change',updateDocuments);
      $('#escrow').bind('change',updateDocuments);


      $('#prelim').bind('change',updateDocuments);
      $('#escrowInstruction').bind('change',updateDocuments);
      $('#reDisclosures').bind('change',updateDocuments);
      $('#homeInspections').bind('change',updateDocuments);
      $('#NTP').bind('change',updateDocuments);
      $('#FWT').bind('change',updateDocuments);




      // $('#MP').bind('change',updateIncNeed);
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

      var returnedFromMonthly = 0;

      socket.on('ReturnMonthlyPayment', function(results){
        // console.log('returnedFromMonthly = ' + returnedFromMonthly);
        returnedFromMonthly++;
        // $('#PP').prop('value', results.inputData.housePrice);
        // $('#EP').prop('value', results.inputData.downPaymentPercent);
        // $('#IR').prop('value', results.RIR);
        $('#LA').text(results.LA).currency({decimals: 2});
        $('#LP').text(results.LP + '%');
        $('#DP').text(results.inputData.downPayment).currency({decimals: 2});
        $('#MP').text(results.MP).currency({decimals: 2});
        // $('#MCP').trigger('change');





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
        updateIncNeed();

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

      socket.on('denyDocumentChange', function(data){
        if(data.state == true){
          $('#'+data.checkbox).prop("checked", false);
        }
        else{
          $('#'+data.checkbox).prop("checked", true);
        }
      });


      socket.on('denyCommunication', function(err){
        var now = new Date();
        var testDate = $.format.date(now, "MMM-dd-yy hh:MMa:");
        // console.log('testDate = ' + testDate);
        var newhtml = "<div class='alert alert-error alert-block'><strong>" + testDate +"</strong> " + err + "</div>";
        $('#allMessages').prepend(newhtml);
      });

      $('a[data-toggle="tab"]').on('shown', function (e) {
        var thisTab = $(this).attr("href");
        var CNExists = $('.commAlertExists').val();
        // console.log('CNExists = ' + CNExists);
        if(thisTab == '#communication' && CNExists != 'false'){
          // console.log('clicked communication tab, hence remove the notification span');
          $('#communicationNotification').remove();
          $('.commAlertExists').val('false');

          var userInfo = urlData(); //grab this users id, and client id
          socket.emit('removeCommunicationNotification',{ userId: userInfo.agentId, clientId:userInfo.clientId, userType: 'realEstateAgent'});
        }//end of if communication tab
        else{
          // console.log('Tab opend = ' + thisTab);
        }//end of not communiction tab
      });//end of identify which tab was clicked






    function updateCoborrowerIncomeNeeded(incomeNeeded, Coborrower){
        if(parseFloat(incomeNeeded) <= parseFloat('300')){
          $('#NCB').text(Coborrower).css({"color": "green"});
          $('#IN').css({"color":"green"});
        }
        else if(parseFloat(incomeNeeded) > parseFloat('300') && parseFloat(incomeNeeded) <= parseFloat('900')) {
          $('#NCB').text(Coborrower).css({"color": "#FF7F24"});
          $('#IN').css({"color":'#FF7F24'});
        }
        else{
          $('#NCB').text(Coborrower).css({"color": "red"});
          $('#IN').css({"color":"red"});
        }

    }//end of updateCoborrowerIncomeNeeded


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
          $('#DTIBack').css({"color": "green"});
          $('#DTIFront').css({"color": "green"});
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
          $('#STATUS').html('<button class="btn btn-danger" href="#" data-toggle="modal"  data-target="#CallGilmerModal">Call XAVIER</button>');
          $('#A3').html('');
          $('#A1').html('');
          $('#A5').html('');
          $('#A3').html('<div class="alert alert-warning"><button class="btn btn-info" href="#" data-toggle="modal"  data-target="#CallGilmerModal">XAVIER</button> "This is a Difficult loan, you need our experienced loan officers to close this client. We are the only ones who can moved this client forward!"</div>');
          $('#A2').html('<div class="alert alert-error"> Reduce Maximum House Price to get A+ </div>');
          $('#A4').html('<div class="alert alert-error"> Increase Income by recommnded amount </div>');
          // $('#A1').html('<div class="alert alert-info"> Reaching limits of purchasing power </div>');
          $('#A5').html('<div class="alert alert-error"> Can you pay down debt? </div>');

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

        $('#MCP').replaceEmpty(0);
        $('#RI').replaceEmpty(0);
        $('#BR1').replaceEmpty(0);
        $('#BR2').replaceEmpty(0);
        $('#BR3').replaceEmpty(0);


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


      function updateDocuments(){
        //console.log($(this).val() + ' is ' + $(this).is(':checked'));
        var userInfo = urlData();
        // socket.emit('updateDocumentsAgent', {checkbox: $(this).val(), state: $(this).is(':checked'), userId: userInfo.agentId, clientId:userInfo.clientId});
        socket.emit('updateDocuments', {checkbox: $(this).val(), state: $(this).is(':checked'), userId: userInfo.agentId, clientId:userInfo.clientId, userType: 'realEstateAgent'});
      }//end of updateDocuments





      $('#messageButton').bind('click', function(){

        // console.log('clicked message button');
        // console.log('message box contained = ' + $('#theMessage').val());

        var now = new Date();
        var testDate = $.format.date(now, "MMM-dd-yy hh:MMa:");        
        // console.log('testDate = ' +testDate);
        var agentName = $('#agentName').val()
        var newhtml = "<div class='alert alert-info alert-block'><div class='row'><div class='span2'><p><strong>"+ agentName +":</strong><br>" + testDate +"</br></p></div><div class='span5'><p>" + $('#theMessage').val() + "</p></div></div></div>";

        $('#allMessages').prepend(newhtml);

        var userInfo = urlData();
        // socket.emit('updateCommunicationToOfficer', {message: $('#theMessage').val(), userId: userInfo.agentId, clientId:userInfo.clientId });
        socket.emit('updateCommunication', {message: $('#theMessage').val(), userId: userInfo.agentId, clientId:userInfo.clientId, userType: 'realEstateAgent' });
        $('#theMessage').val('');
      });//end of messageButton bind





      function onlynums(n){
        return n.replace(/[,A-Za-z$-]/g, '');
      }

      $.fn.replaceEmpty = function(n){
        //- console.log('was this called properly? val = ' + $(this).val())
        if($(this).val().length === 0 ){
          //- console.log('value is empty hence will be replaced with = ' + n)
          $(this).val(n);
          // $(this).trigger('change');
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
            borrower1: BR1, borrower2 : BR2, borrower3: BR3, needCoborrower: NCB, loanPaperGrade: loanPaperGrade
        };
        return inputdata;
      };//end of grabAllData


      function urlData(){
        var locationObj = window.location.href;
        // console.log('locationObj = ' + locationObj);
        var spliturl = locationObj.split('/');
        // console.log('client = ' + spliturl[6]);
        // console.log('user = ' + spliturl[4]);
        var data = {agentId:  spliturl[4], clientId:  spliturl[6]};
        return data;
      }





    });//end of document ready


    $(document).ready(function () {
      // $('#PP').trigger('change');
      $('#PP').currency({
           hidePrefix: true,
           decimals: 0
      });
      $('#BR1').currency({
           hidePrefix: true,
           decimals: 0
      });
      $('#BR2').currency({
           hidePrefix: true,
           decimals: 0
      });
      $('#BR3').currency({
           hidePrefix: true,
           decimals: 0
      });


      $('#MCP').currency({
           hidePrefix: true,
           decimals: 0
      });


      $('#RI').currency({
           hidePrefix: true,
           decimals: 0
      });


    $('.isMoney').currency({
         decimals: 0
      });

    // $('.isMoney').currency({
    //      decimals: 2
    //   });



$(".isPhoneInput").mask("(999) 999-9999");


    $('.warningSign').bind('click',function(){
      $('#infoTab a:last').tab('show');
    });//end of .warningSign



    });

