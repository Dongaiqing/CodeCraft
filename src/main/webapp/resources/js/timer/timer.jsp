<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE HTML>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
p {
  text-align: right;
  font-size: 60px;
  margin-top:0px;
}
</style>


<script>
/*
$("#formId").submit(function (event) {
	  $.post('/route', $("#formId").serialize(), function (data) {
	 	console.log(data) //data is the response from the backend
	  });
	  event.preventDefault();
	});
*/
  // Set the date we're counting down to

  var testTime= 1;
  var testends=0;
  if(testends == 0){
    testends=new Date().getTime()+testTime*60000;
  }
  
  // Update the count down every 1 second
  var x = setInterval(function() {
  
      // Get todays date and time
      var now = new Date().getTime();
      
      // Find the distance between now and the count down date
      var distance = testends - now;
      
      // Time calculations for days, hours, minutes and seconds
     
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Output the result in an element with id="demo"
      document.getElementById("demo").innerHTML =hours + "h "
      + minutes + "m " + seconds + "s ";
      
      // If the count down is over, write some text 
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("demo").innerHTML = "EXPIRED";
          document.getElementById("code_editor").disabled=true;
      }
  }, 1000);
  </script>

<!-- Use jquery to send post request the content is the code 
$('code_editor').val()
-->
<script>

  
  function runCode() {
	  alert(document.getElementById("code_editor").innerHTML);
  }
</script>

</head>
<body>

<!-- Use bulma.io css and use flexbox -->

<p id="demo"></p>
<div id="container" style=" display: inline;">
 <div id="lang">
 <select name="p_language" id="lang_selector">
  <option name="java" value="" default> Java</option>
	<option name="js" value="" > Javascript</option>
 </select>
</div>
<div style="float: left">
<textarea id="code_editor" cols='80' rows='60'> public static void main(String[] args) {} </textarea>
<textarea disabled id="display_result" cols='80' rows='60'> </textarea>

<!-- Need to get JQuery js lib, and use $.ajax(type: post) -->
<button name="run" id="runCode" onclick="runCode();">Run</button>
</div>
</div>
</body>
</html>
