var siteWidth = 1280;
var scale = screen.width /siteWidth


function attachListeners(){
	var coll = document.getElementsByClassName("panelTitle");
	var i;

		for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "flex") {
		  content.style.display = "none";
		} else {
		  content.style.display = "flex";
		}
	  });
	}
}


