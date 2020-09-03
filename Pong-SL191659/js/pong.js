function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 

var txt;
if (confirm("Desea Jugar con Dos Jugadores")) {
  include("js/player2.js");
} else {
  include("js/player1.js");
}