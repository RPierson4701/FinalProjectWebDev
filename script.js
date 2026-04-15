console.log(location.hostname);
document.querySelector("head").innerHTML="<title>"+location.pathname.substring(1)+"</title><link rel='stylesheet' href='"+location.hostname+"/style.css'>";