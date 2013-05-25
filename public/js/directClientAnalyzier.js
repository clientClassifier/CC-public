$(function() {
    var chart;

$(document).ready(function () {
  // console.log('window.location.origin = ' + window.location.origin)
  var socket = io.connect();
    
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            credits: {
              enabled: false
            },
            title: {
                text: 'What You Can Purchase'
            },
            xAxis: {
                categories: [
                    '0',
                    '0',
                    '0',
                    '0',
                    '0',
                    '0'
                ],
                labels: {
                  formatter: function() {

                    // var monthly = 
                    // var formated = monthly.currency();
                    // console.log('monthly  = ' + monthly)
                    return '$' + addCommas(this.value)
                  }
                },
                title:{
                  text: 'Monthly Payment ($)'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'House Price ($)'
                }
            },
            // legend: {
            //     layout: 'vertical',
            //     backgroundColor: '#FFFFFF',
            //     align: 'left',
            //     verticalAlign: 'top',
            //     x: 100,
            //     y: 70,
            //     floating: true,
            //     shadow: true
            // },
            tooltip: {
              useHTML: true,
                formatter: function() {





                    if(this.point.remainingIncome != parseInt(0) ){
                        return 'Your Grade = ' +  this.point.grade  +' <p> Better grade with additional $' +   addCommas(this.point.remainingIncome)   + ' in income</p>';
                    }
                    else{
                      return 'Your Grade = ' + this.point.grade 
                    }






                    // return '('+
                    //     this.x +', '+ this.y + ', ' + this.point.color +   ' , ' +  this.point.remainingIncome + ')';
                }   
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        // color: colors[0],
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            return '$' + addCommas(this.point.y)
                        }
                    }
                }
            },
            series: [{
              showInLegend : false,
              name: 'Grade',
              // data: [[4, 49.9],[12, 71.5], [16,106.4]]
              data: [0, 0, 0, 0 ,0, 0]
              // dataLabels :{
              //     enabled: true,
              //     rotation: 0,
              //     color: '#FFFFFF',
              //     align: 'center',
              //     x: 0,
              //     y: 90,
              //     formatter: function() {
              //         return this.point.grade;
              //     }                  
              // }
            }]
      });



socket.on('updateAnalysisData', function(results){
    // console.log('(BO) - updateAnalysisData: returned with new data');
    // console.log('(BO) - ideal house = ' + results.idealHouse); 
    // console.log('(BO) - Data from server  = ' + results.All);
    // for(var i = 0; i < 3;i++){
    //     for(var j = 0; j < 2;j++){
    //         console.log('results.All['+i+']['+j+'] = ' + results.All[i][j]);
    //     }
    // }

    // for(var i = 0; i < 6;i++){
    //     console.log('sorted = ('+ results.All[i][0] + ' , ' + results.All[i][1] + ' , ' + results.All[i][2] + ' , ' + results.All[i][3]  + ')');
    // }//end of i

      chart.xAxis[0].setCategories([results.All[0][0], results.All[1][0], results.All[2][0],results.All[3][0],results.All[4][0],results.All[5][0] ]);


    for(var i = 0; i<6; i++){
      chart.series[0].data[i].update({
                                  monthlyPayment: parseFloat(results.All[i][0]),
                                  y: parseFloat(results.All[i][1]),
                                  color: results.All[i][2],
                                  remainingIncome : results.All[i][3],
                                  grade: results.All[i][4]
                                })
      // console.log('(BO) - updated chart')
    }



    var formatedGraph = formatGraphData(chart.series[0].data);
    // console.log('Formated graph monthly = '+ formatedGraph);
    $('#formGraphData').val(formatedGraph);
    var testingGraphData = $('#formGraphData').val();

    // var testingGraphData = chart.series[0].data.map(JSON.stringify);

    var graphDataObj = JSON.parse(testingGraphData);

    console.log('graphDataObj = ' + graphDataObj[0].monthlyPayment)

    // console.log('testingGraphData = ' + testingGraphData)
    // console.log('testingGraphData lenght = ' + testingGraphData.length)
    // console.log('testingGraphData = ' + testingGraphData[0].monthlyPayment)
    // console.log('testingGraphData = ' + testingGraphData[1])
    // console.log('testingGraphData = ' + testingGraphData[2])
    // console.log('testingGraphData = ' + testingGraphData[3])
    // console.log('testingGraphData = ' + testingGraphData[4])
    // console.log('testingGraphData = ' + testingGraphData[5])


    // chart.hideLoading('');
  });//end of updateAnalysisData



  $('#income').prop('value', 0);
  $('#debt').prop('value', 0);
  $('#HourPay').prop('value',0)
  $('#BWP').prop('value',0)
  $('#YP').prop('value',0)


  $('#income').bind('change',function(){
    $('#income').replaceEmpty(0);
    updateAnalysis();
    // updateAnalysisFrontOnly();
  });//end o #PP change

  $('#income').click(showIncome);

  function showIncome(){
    $('#HourPay').val(0);
    $('#BWP').val(0);
    $('#YP').val(0);
    $('#HourPaytext').text('');
    $('#BWPtext').text('');
    $('#YPtext').text('');
    $('#CMIModal').modal('show');
  }

  $('#debt').bind('change',function(){
    $('#debt').replaceEmpty(0);
    updateAnalysis()
    // updateAnalysisFrontOnly();
  });//end o #PP change

  $('#debt').click(function(){
    // console.log('someone has clicked the debt input box');
    $('#sumDebts').modal('show');
  })


  $('#interest').bind('change', function(){
    updateAnalysis();
  })

  $('#DPMethod').bind('change', function(){
    updateAnalysis();
  })

  $('#enterDebt').click(function(){
    var debtfound = GrabAllDebtInputs();
    //onlynums
    var debtString = '$' + addCommas(debtfound)

    $('#debt').text(debtString)
    $('#debt').val(debtfound);
    $('#debt').trigger('change');
  });


      $('#HourPay').keyup(function(){
        // $('#BWP').prop('value', '');
        $('#BWPtext').empty();
        // $('#YP').prop('value', '');
        $('#YPtext ').empty();
        // $('#HourPay').replaceEmpty(0);
        var HP = parseFloat(onlynums($('#HourPay').val()));
        var MonPay = (HP*40*52)/12;
        if(isNaN(MonPay)){
          console.log('Mon Pay is null!!!');
          $('#HourPaytext').text(' $0');
        }
        else{
          $('#HourPaytext').text(' ' + MonPay.toFixed(2));
          $('#HourPaytext').currency();
        }
      });
      $('#BWP').keyup(function(){
        // $('#HourPay').prop('value', '');
        $('#HourPaytext').empty();
        // $('#YP').prop('value', '');
        $('#YPtext ').empty();
        // $('#BWP').replaceEmpty(0);
        var BWP = parseFloat(onlynums($('#BWP').val()));
        var MonPay = (BWP*26)/12;
        $('#BWPtext').text(' ' + MonPay.toFixed(2));
        $('#BWPtext').currency();
      });
      $('#YP').keyup(function(){
        // $('#HourPay').prop('value', '');
        $('#HourPaytext').empty();
        // $('#BWP').prop('value', '');
        $('#BWPtext').empty();
        // $('#YP').replaceEmpty(0);

        var YP = parseFloat(onlynums($('#YP').val()));
        var MonPay = (YP)/12;
        $('#YPtext ').text(' ' + MonPay.toFixed(2));
        $('#YPtext ').currency();
      });


      $('#requestConsultation').click(function(){
        // console.log('request button clicked!!!!')
        var formGraphData = $('#formGraphData').attr('value');
        if(formGraphData.length>0 && typeof(formGraphData) != 'undefined'){
          $('#requestForm').submit();
        }else{
          //$('#msgError').addClass('alert');
          //$('#msgError').addClass('alert-error');
          //$('#msgError').addClass('alert-block');
          //$('#msgError').append($('<a class="close" id="btnCloseRC" data-dismiss="alert", href="#"">').text('x'),$('<h4 class="alert-heading">').text('Error!'),$('<p>').text('need to calculate your monthly income'));
          $('#btnsConsultations').prepend($('<button class="btn btn-danger pull-left" id="btnCalIncome">').text('need to calculate your monthly income'));
          $('#btnCalIncome').click(function(){
              $('#helpBuyHome').modal('hide');
              showIncome();
             // $('#btnsConsultations').remove('#btnCalIncome');
              $('#btnCalIncome').remove();
          }); 
           
        }

      });//end of requestConsultation





      $('#enterIncome').click(function(){
        // console.log('income button was clicked!')
        var incomefound = GrabCalculatedValue();
        if(typeof(incomefound) == 'undefined'){
          // console.log('No income was entered');
          return;
        }
        var incomeString = '$' + addCommas(incomefound);
        $('#income').text(incomeString)
        $('#income').val(incomefound);
        $('#income').trigger('change');
      });

      $('#addToIncome').click(function(){
        // console.log('Add to previous income');
        var currentIncome = parseFloat(onlynums($('#income').val()));
        var incomefound = GrabCalculatedValue();
        if(typeof(incomefound) == 'undefined'){
          // console.log('No income was entered');
          return;
        }

        // console.log('currentIncome = ' + currentIncome);
        // console.log('incomefound = ' + incomefound);
        var totalIncome = parseFloat(incomefound) + currentIncome;
        // console.log('total income = ' + totalincome);
        // console.log('total income currecnty  = ' + totalincome.toString().currency())
        // $('#income').currency();

        var incomeString = '$' + addCommas(totalIncome)

        $('#income').text(incomeString)
        $('#income').val(totalIncome);
        $('#income').trigger('change');     
      });



      $('#newIncome').click(function(){
        // console.log('clicked new Income button');
        // $('#inputTable').insertRow(1);
        // console.log('newIncome value = ' + $('#newIncome').val());
        // $('#informationModal').modal('show');
        // $('#newIncome').remove();
        // var table=document.getElementById("inputTable");
        // var row=table.insertRow(2);
        // var cell1=row.insertCell(0);
        // var cell2=row.insertCell(1);
        // var cell3 = row.insertCell(2);
        // cell1.innerHTML='<button id="newIncome" class="btn btn-primary">Add</button>';
        // cell2.innerHTML='<input id="income" type="text" name="income" placeholder="Total Income" class="span2 numeric" , value="0"/>';
        // cell3.innerHTML='<input id="debt" type="text" name="debt" placeholder="Total Debt" class="span2 numeric",  value="0"/>';

      })


      $('.hasPop').mouseenter(function() {
        // console.log('Entered grade');
        $(this).popover('show');
      }).mouseleave(function() {
        // console.log('Left grade');
        $(this).popover('hide');
      });




  $('#requestForm').validate({
    rules: {
      firstName: {
        required: true
      },
      lastName: {
        required: true
      },
      consumerEmail: {
        required: true,
        email: true
      },
      cellPhone: {
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
      consumerEmail:{
        required: "Please enter your email"
      },
      cellPhone: {
        required: "Please enter your cell phone number"
      },
      TOS : {
        required: "You must accept the Terms of service"
      }
    }
  });
  $(".isPhone").mask("(999) 999-9999");



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
  });//end of input numerics




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

  function updateAnalysis(){
    var income = parseFloat(onlynums($('#income').val()));
    var debt = parseFloat(onlynums($('#debt').val()));
    var interest = parseFloat($('#interest').val());
    var DPMethod = $('#DPMethod').val();


    $('#formIncome').val(income);//update form inputs
    $('#formDebt').val(debt);//update form inputs
    $('#formInterest').val(interest); //update form inputs
    // console.log('form interest = ' +$('#formIncome').val());

    // console.log('array of data in chart = '+ chart.series[0].data.length);
    // var formatedGraph = formatGraphData(chart.series[0].data);
    // console.log('Formated graph monthly = '+ formatedGraph);
    // $('#formGraphData').val(formatedGraph);

    // var testingGraphData = chart.series[0].data;
    // console.log('testingGraphData = ' + testingGraphData.toString())

    socket.emit('updateAnalysis',{income: income, debt: debt, interest: interest, DPMethod: DPMethod});
  }//end updateAnalysis



  function formatGraphData(allData){

    var jsonObj = [];
    // console.log('formatGraphData function allData length = ' + allData.length)

                                  // y: parseFloat(results.All[i][1]),
                                  // color: results.All[i][2],
                                  // remainingIncome : results.All[i][3],
                                  // grade: results.All[i][4]
    // for(var i = 0; i< allData.length; i++){
    //   console.log('allData  house price = ' + allData[i].monthlyPayment)
    // }


    for(var i = 0; i < allData.length;i++){
        

        // console.log(' allData[i] =' +  allData[0][i])
        // console.log(' allData[i][0] =' +  allData[0][i])
        var barData = {};
        barData.monthlyPayment = allData[i].monthlyPayment;
        barData.housePrice = allData[i].y;
        barData.color = allData[i].color;
        barDataremainingIncome = allData[i].remainingIncome;
        barData.grade = allData[i].grade;
        
        jsonObj.push(barData)

        // console.log('barData = ' + barData.monthlyPayment)

        // console.log('jsonOBject MOnthly = ' + JSON.stringify(barData, null, '\t'))
    }//end of i for loop

    for(var i =0 ; i < jsonObj.length; i++){
        // console.log('jsonObj['+i+'] monthly = ' +  jsonObj[i].monthlyPayment)
    }
    

    var stringed = JSON.stringify(jsonObj);
    // console.log('JSON.stringify(jsonObj) = ' + JSON.stringify(jsonObj))
    // console.log('first object in stringify = ' + stringed[2])

    return stringed;
  }//end of format graph Data


  function updateAnalysisFrontOnly(){
    var income = parseFloat(onlynums($('#income').val()));
    var debt = parseFloat(onlynums($('#debt').val()));
    // var house = parseFloat(onlynums($('#houseSlider').val()));
    // var MP = parseFloat(onlynums($('#MPSlider').val()));
    // console.log('house price = ' + house);
    socket.emit('updateAnalysisFrontOnly',{income: income, debt: debt});
  }//end updateAnalysis

      function GrabAllDebtInputs(){
        $('#car1').replaceEmpty(0);
        $('#car2').replaceEmpty(0);
        $('#car3').replaceEmpty(0);

        $('#card1').replaceEmpty(0);
        $('#card2').replaceEmpty(0);
        $('#card3').replaceEmpty(0);
        $('#card4').replaceEmpty(0);
        $('#card5').replaceEmpty(0);
        $('#card6').replaceEmpty(0);

        $('#child').replaceEmpty(0);

        //onlynums
        var car1 = parseFloat(onlynums($('#car1').val()));
        var car2 = parseFloat(onlynums($('#car2').val()));
        var car3 = parseFloat(onlynums($('#car3').val()));

        var card1 = parseFloat(onlynums($('#card1').val()));
        var card2 = parseFloat(onlynums($('#card2').val()));
        var card3 = parseFloat(onlynums($('#card3').val()));
        var card4 = parseFloat(onlynums($('#card4').val()));
        var card5 = parseFloat(onlynums($('#card5').val()));
        var card6 = parseFloat(onlynums($('#card6').val()));

        var child = parseFloat(onlynums($('#child').val()));

        var totalDebt = car1 + car2 + car3  + card1 + card2 + card3 + card4 + card5 + card6 + child;

        // console.log('totalDebt = ' + totalDebt);
        return totalDebt
      }//end of GrabAllDebtInputs



      function GrabCalculatedValue(){

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


      function addCommas(value){
        value = String(value);
        var num = value.match(/[0-9,]*/g)[0];
        var decimalNum = value.match(/[.][0-9]*/) || "";
        if(num) {
          var wholeNum = num.match(/[0-9]/g).reverse().join("").match(/[0-9]{1,3}/g).join(",").match(/./g).reverse().join("");
          //- console.log(wholeNum);
          var resultNum = wholeNum + decimalNum;
          return resultNum
          // $(this).val(resultNum);
        }
        else{
          // $(this).val(num);
          return num;
        }
      }//end of addcommas


})//end of document ready 

})//end of wrapper function for chart