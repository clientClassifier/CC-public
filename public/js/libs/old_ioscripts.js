    $(document).ready(function () {
      var socket = io.connect();
      // $("#PP").validate({
      //   expression: "if(!isNaN(VAL) && VAL) return true; else return false;",
      //   message: "Enter A Number!",
      //   live: true
      // });
      // $('#PP').valid8({
      //     regularExpressions: [
      //             { expression: /^[0-9]+$/, errormessage: 'You can only use the letters A-Z and numbers'}
      //         ]
      //     })
      
      
      $('#PP').bind('change',function(){
        $('#PP').replaceEmpty(250000);
        $('#LA').trigger('change');
         var PP = onlynums($('#PP').val());
      });
      $('#LA').bind('change',function(){
        var LP = parseFloat($('#LP').text());
        // var LP = $('#LP').val();
        //- console.log("#LA binded event: LP = " + LP)
        var PP = onlynums($('#PP').val());
        //- var test = onlynums(PP);
        //- console.log("PP = " + PP);
        //- console.log("LP = " + LP);

        //- if(isNumber(PP) == true){
        //- $('#PPISTRUE').text("PP was a number")
        //- }
        //- else{
        //- $('#PPISTRUE').text("PP was false!!!")
        //- }
        var LA = (LP*PP)/100;
        var DP = PP - LA;
        // console.log('down payment = ' + DP);
        // $('#DP').text(DP);


        $('#LA').text(LA);
        $('#LA').currency({decimals: 0});
        $('#DP').trigger('change');
        var IR = $('#IR').val();
        // var lp2 = $('#LP').val()
        //- var test1 = "6,150,010";
        //- var test = onlynums(test1);
        socket.emit('ChangeMonthly',{LA: LA, IR: onlynums(IR), LP: LP});
      });
      $('#LP').bind('change',function(){
        var LP = parseFloat($('#LP').text());
        //- console.log("LP change = " + LP)
        // var LP = $('#LP').val();
        var EP = 100 - LP;
        $('#EP').prop('value', EP);
        $('#LA').trigger('change');
        });
      $('#EP').bind('change',function(){
        $('#EP').replaceEmpty(3.5);
        //- console.log("DP percent = " + $('#EP').val())
        if($('#EP').val() < parseFloat(3.5)){
          $('#EP').val(3.5);
        }
        else if($('#EP').val() > parseFloat(100.0)){
          $('#EP').val(100);
        }

        var EP = $('#EP').val();
        //- if(EP >= 100){
        //-   EP = '100'
        //-   console.log("loan percent was greater than 100 = " + EP )
        //- }
        //- console.log("loan percent is less than 100 = " + EP)
        var LP = 100 - EP;
        $('#LP').text(LP + "%");
        // $('#LP').prop('value', LP);
        $('#LA').trigger('change');
        });
      $('#DP').bind('change',function(){ //this is not used at the momment
        var EP = $('#EP').val();
        //- if(EP >= 100){
        //-   EP = '100'
        //-   console.log("loan percent was greater than 100")
        //- }
        //- console.log("loan percent is less than 100")
        var PP = $('#PP').val();
        var DP = (EP*onlynums(PP))/100;
        console.log('print dp = ' + DP);
        $('#DP').text(DP);
        $('#DP').currency({decimals: 2});
        // console.log('downpayment = ' + DP)
        // $('#DP').prop('title', DP)
        // $('[rel=tooltip]').tooltip({
        //   title : DP
        // });
        // console.log('downpayment in tooltip = ' + $('#DP').prop('title'))
        
        });
      $('#IR').bind('change',function(){
        //- console.log("LA before anything ! = " + $('#LA').text())
        var LA = onlynums($('#LA').text());
        // console.log('IR before = ' + $('#IR').val());

        //- var after = replaceEmpty($('#IR').val())
        //- console.log('IR after replace = ' + after)

        $('#IR').replaceEmpty(5);


        if($('#IR').val() < parseFloat(2)){
          $('#IR').val(2);
        }
        else if($('#IR').val() > parseFloat(7)){
          $('#IR').val(7);
        }
        // console.log('IR after = ' + $('#IR').val());
        //- LA = LA.substring(1);
        //- console.log("LA after removing everything ! = " + LA)
        //- console.log("LA no remove = " + LA);
        var IR = $('#IR').val();
        var LP = parseFloat($('#LP').text());
        //- console.log("grabed LP = " + LP)
        // var LP = $('#LP').val();
        socket.emit('ChangeMonthly',{LA: LA, IR: IR, LP: LP});
        });
      $('#MP').bind('change',updateIncNeed);
      $('#MCP').bind('change',updateIncNeed);
      $('#RI').bind('change',updateIncNeed);
      $('#BR1').bind('change',updateIncNeed);
      $('#BR2').bind('change',updateIncNeed);
      $('#BR3').bind('change',updateIncNeed);

      // initializtions for default view
      $('#PP').prop('value', '250,000');
      $('#LP').text('96.5%');
      $('#LA').text('$241,250');

      $('#DP').text('$8,750');
      // $('[rel=tooltip]').tooltip({
      //   title : '8750'
      // });
      // $('body').tooltip({
      //   selector: '[rel=tooltip]'
      //   });


      //- $('#LA').prop('placeholder', '241,250')
      $('#MP').text('$1,795.68');
      //- $('#IN').text('1557.21').css({"color":"red"})
      //- $('#NCB').text('YES').css({"color":"red"})
      //- $('#LP').prop('value', 80).trigger('change');
      $('#EP').prop('value', 3.5);
      $('#RI').prop('value', 0);
      $('#MCP').prop('value', 0);
      $('#BR1').prop('value', 0);
      $('#BR2').prop('value', 0);
      $('#BR3').prop('value', 0);
      $('#IR').prop('value', 5);

      socket.on('ReturnMonthlyPayment', function(results){
        $('#MP').text(results.MP).trigger('change');
        $('#MP').currency({decimals: 2});
        $('#IR').prop('value', results.RIR);
        });

      socket.on('ReturnIncomeNeeded', function(result){
        $('#IN').text(result.incneeded);
        $('#IN').currency();
        $('#PIDTI').text(result.inc47.toFixed(2)).css({"color":"#0000CD"});
        $('#PIDTI').currency();
        if(parseFloat(result.incneeded) <= parseFloat('300')){
          $('#NCB').text('NO');
          $('#NCB').css({"color": "green"});
          $('#IN').css({"color":"green"});
        }
        else if(parseFloat(result.incneeded) > parseFloat('300') && parseFloat(result.incneeded) <= parseFloat('700')) {
          $('#NCB').text('MAYBE');
          $('#NCB').css({"color": "#FF7F24"});
          $('#IN').css({"color":'#FF7F24'});
        }
        else{
          $('#NCB').text('REQUIRED');
          $('#IN').css({"color":"red"});
          $('#NCB').css({"color": "red"});
        }

        var MPtemp = $('#MP').text();
        //- MPtemp = MPtemp.substring(1);
        var MP = parseFloat(onlynums(MPtemp));
        //- console.log("MP after temp = " + MP)
        var TMI = parseFloat(onlynums($('#BR1').val())) + parseFloat(onlynums($('#BR2').val())) + parseFloat(onlynums($('#BR3').val()));
        var DTIF = (MP/TMI)*100;
        DTIF = DTIF.toFixed(2);
        $('#DTIFront').text(DTIF);
        var BR2 = result.BR2 * 100;
        $('#DTIBack').text(BR2.toFixed(2));
        if(BR2 <= parseFloat('0.1')){
          //- $('#ClientGrade').text(" F");
          //- $('#ClientGrade').css({"color":"darkred"});
          $('#NCB').empty();
          $('#IN').empty();
          $('#ClientGrade').empty();
          $('#DTIBack').empty();
          $('#DTIFront').empty();
        }
        else if(BR2 > parseFloat('0.1') && BR2.toFixed(2) <= parseFloat('47')){
          $('#DTIBack').css({"color": "green"});
          $('#DTIFront').css({"color": "green"});
          $('#ClientGrade').text(" A+");
          $('#ClientGrade').css({"color":"green"});
          $('#A1').html('');
          $('#A2').html('');
          $('#A3').html('');
          $('#A4').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-success" href="#" data-toggle="modal"  data-target="#UserInfoModal">GET PREQUAL</button>');
          $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> you have been aproved! Get your prequal! </p></div>');
        }
        else if(BR2 > parseFloat('47') && BR2 <= parseFloat('48')){
          $('#DTIBack').css({"color": "#FF7F24"});
          $('#DTIFront').css({"color": "#FF7F24"});
          $('#ClientGrade').text(" A");
          $('#ClientGrade').css({"color":"green"});
          $('#STATUS').text('APPROVED! GET PREQUAL');
          $('#STATUS').css({"color": "green"});
          $('#A1').html('');
          $('#A2').html('');
          $('#A4').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-success" href="#" data-toggle="modal"  data-target="#UserInfoModal">GET PREQUAL</button>');
          $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> you have been aproved! Get your prequal! </p></div>');
        }
        else if(BR2 > parseFloat('48') && BR2 <= parseFloat('50')){
          $('#DTIBack').css({"color": "#FF7F24"});
          $('#DTIFront').css({"color": "#FF7F24"});
          $('#ClientGrade').text(" B");
          $('#ClientGrade').css({"color":"#FF7F24"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "#FF7F24"})
          $('#A5').html('');
          //- $('#A1').html('');
          //- $('#A2').html('');
          $('#A1').html('<div class="alert"> Reduce Maximum House Price to get A+ </div>');
          $('#A2').html('<div class="alert"> Increase Income by recommnded amount </div>');
          $('#A3').html('<div class="alert alert-info"> Reaching limits of Viability </div>');
          $('#A4').html('<div class="alert"> Can you pay down debt? </div>');
          $('#A5').html('');
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-warning" href="#" data-toggle="modal"  data-target="#CallGilmerModal" >Call Gilmer</button>');
          //- $('#A5').html('<div class="alert alert-success"><h4 class="alert-heading">CONGRATULATIONS!</h4> <p> you have been aproved! Get your prequal! </p></div>');
        }
        else if(BR2 > parseFloat('50') && BR2 <= parseFloat('55')){
          $('#DTIBack').css({"color": "red"});
          $('#DTIFront').css({"color": "red"});
          $('#ClientGrade').text(" C");
          $('#ClientGrade').css({"color":"red"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "red"})
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-warning" href="#" data-toggle="modal"  data-target="#CallGilmerModal">Call Gilmer</button>');
          $('#A3').html('');
          $('#A5').html('');
          $('#A1').html('<div class="alert"> Reduce Maximum House Price to get A+ </div>');
          $('#A2').html('<div class="alert"> Increase Income by recommnded amount </div>');
          $('#A4').html('<div class="alert"> Can you pay down debt? </div>');
        }
        else{
          $('#DTIBack').css({"color": "darkred"});
          $('#DTIFront').css({"color": "darkred"});
          $('#ClientGrade').text(" D");
          $('#ClientGrade').css({"color":"darkred"});
          //- $('#STATUS').text('CALL GILMER')
          //- $('#STATUS').css({"color": "darkred"})
          $('#STATUS').html('');
          $('#STATUS').html('<button class="btn btn-warning" href="#" data-toggle="modal"  data-target="#CallGilmerModal">Call Gilmer</button>');
          $('#A3').html('');
          $('#A5').html('');
          $('#A1').html('<div class="alert"> Reduce Maximum House Price to get A+ </div>');
          $('#A2').html('<div class="alert"> Increase Income by recommnded amount </div>');
          $('#A4').html('<div class="alert"> Can you pay down debt? </div>');
        }







        });//end of socket 'ReturnIncomeNeeded'

      $('input.numeric').change(function(){
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
      //- $('span.numeric').change(function(){
      //-   var num = $(this).text().match(/[0-9,]*/g)[0];
      //-   var decimalNum = $(this).text().match(/[.][0-9]*/) || "";
      //-   //- console.log(num);
      //-   //- console.log(decimalNum);
      //-   if(num) {
      //-   var wholeNum = num.match(/[0-9]/g).reverse().join("").match(/[0-9]{1,3}/g).join(",").match(/./g).reverse().join("");
      //-   //- console.log(wholeNum);
      //-   var resultNum = wholeNum + decimalNum;
      //-   $(this).text(resultNum);
      //-   }
      //-   else{
      //-   $(this).text(num);
      //-   }
      //- })

      

      //- $('#HourPay').bind('change',function(){
      //-   var HP = parseFloat($('#HourPay').val())
      //-   var MonPay = (HP*40*52)/12
      //-   $('#HourPaytext').text(' ' + MonPay.toFixed(2))
      //-   $('#HourPaytext').currency()
      //- })
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
        var incomefound = GrabCalculatedValue();
        $('#BR1').prop('value', incomefound);
        $('#BR1').trigger('change');
      });
      $('#INC2').click(function(){
        var incomefound = GrabCalculatedValue();
        $('#BR2').prop('value', incomefound);
        $('#BR2').trigger('change');
      });
      $('#INC3').click(function(){
        var incomefound = GrabCalculatedValue();
        $('#BR3').prop('value', incomefound);
        $('#BR3').trigger('change');
      });

      function GrabCalculatedValue(){
        //- console.log('hp1 = ' + onlynums($('#HourPaytext').text()))
        //- console.log('bwp1 = ' + onlynums($('#BWPtext').text()))
        //- console.log('yp1 = ' + onlynums($('#YPtext').text()))
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


      function updateIncNeed(){
        //- console.log('inc needed this value = ' + $(this).val());
        $(this).replaceEmpty(0);
        var MP = $('#MP').text();
        //- console.log("MP before = " + MP)
        //- MP = MP.substring(1);
        //- console.log("MP after = " + onlynums(MP))
        var MCP = onlynums($('#MCP').val());
        var TMI = parseFloat(onlynums($('#BR1').val())) + parseFloat(onlynums($('#BR2').val())) + parseFloat(onlynums($('#BR3').val()));
        var RI = parseFloat(onlynums($('#RI').val()));
        socket.emit('ChangeIncomeNeeded',{MP: onlynums(MP), MCP: MCP, TMI: TMI, RI: RI});
      }
      // function isNumber(n) {
      //   return !isNaN(parseFloat(n)) && isFinite(n);
      // }
      // function removecommas(n){
      //   return n.replace(/,/g,'');
      // }
      function onlynums(n){
        return n.replace(/[,A-Za-z$-]/g, '');
      }
      // function addcommas(n){
      //   var num = $(this).val().match(/[0-9,]*/g)[0];
      //   var decimalNum = $(this).val().match(/[.][0-9]*/) || "";
      //   //- console.log(num);
      //   //- console.log(decimalNum);
      //   if(num) {
      //   var wholeNum = num.match(/[0-9]/g).reverse().join("").match(/[0-9]{1,3}/g).join(",").match(/./g).reverse().join("");
      //   //- console.log(wholeNum);
      //   var resultNum = wholeNum + decimalNum;
      //   $(this).val(resultNum);
      //   }
      // }

      //- function replaceEmpty(n){
      //-   console.log("input variable  = " + n)
      //-   if(n = ''){
      //-     console.log("variable was empty will return a number 0")
      //-     return 0;
      //-   }
      //-   else if(n = null){
      //-     console.log("Input was not empty????")
      //-     return n;
      //-   }
      //-   else{
      //-     console.log("ok now i dont understand")
      //-     return n;
      //-   }
      //- }

      //- function replaceEmpty(){
        
      //- }

      $.fn.replaceEmpty = function(n){
        //- console.log('was this called properly? val = ' + $(this).val())
        if($(this).val().length === 0 ){
          //- console.log('value is empty hence will be replaced with = ' + n)
          $(this).val(n);
          $(this).trigger('change');
        }
        
      };




      });

