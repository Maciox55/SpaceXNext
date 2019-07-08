var launches=new Array();
var launchesDOM = document.getElementById("launches");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var diff;
var successLandings = 0;
var successLaunches = 0;
var reflownCores = 0;
window.onload = getAllLaunches();
function getAllLaunches() {
	const Http = new XMLHttpRequest();
		const Http2 = new XMLHttpRequest();

	const getAll = 'https://api.spacexdata.com/v3/launches?order=desc';
	const getNext3 = 'https://api.spacexdata.com/v3/launches/upcoming?limit=3';
	const getPast = 'https://api.spacexdata.com/v3/launches/past?order=desc';
	
	
	Http.open("GET",getNext3);
	Http.send();
	
	Http.onreadystatechange=(e)=>{
			if(Http.status === 200 && Http.readyState===4)
			{
				launches=JSON.parse(Http.responseText).reverse();
				console.table(launches);
				console.log(launches.length);
				countdown(launches[2].launch_date_unix);
				Http2.open("GET",getPast);
				Http2.send();

				Http2.onreadystatechange=(e)=>{

					if(Http2.status === 200 && Http2.readyState===4)
					{
						test = JSON.parse(Http2.responseText);
						console.log(test);
						for(var i =0; i<test.length;i++)
						{
							launches.push(test[i]);	
						}
						console.table(launches);
						console.log(launches.length);
						getStats();
						drawDOM();
						attachListeners();
						

					}
				}
			}
		}
}


function drawDOM(){
	var sLaunches = document.getElementById("sLaunches");
	var sLandings = document.getElementById("landings");
	var reflown = document.getElementById("reflown");
	sLaunches.innerHTML = successLaunches;
	sLandings.innerHTML = successLandings;
	reflown.innerHTML = reflownCores;
	for(var l=0; l<launches.length;l++)
		{	
			var date = new Date(launches[l].launch_date_unix*1000);
			console.log(date);
			var launchTemplate=`<div class="panelTitle">
									<p class="title"> `+launches[l].mission_name+`</p>
									<p class="date"> `+date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear()+`</p>
									<button class="expand" type="button">
										<i class="fas fa-chevron-down"></i>
									</button>
								</div>
								<div class="details collapsible">
									<div class="columns">
										<ul class="col left">
											<li><d class="detail">Rocket: </d>${launches[l].rocket.rocket_name} ${launches[l].rocket.first_stage.cores[0].block != null? ' Block '+ launches[l].rocket.first_stage.cores[0].block +' '+ launches[l].rocket.first_stage.cores[0].core_serial: '' }</li>
											<li><d class="detail">Launch Site:</d> ${launches[l].launch_site.site_name}  </li>
											<li><d class="detail">Payload Type:</d> ${launches[l].rocket.second_stage.payloads[0].payload_type}</li>
											${launches[l].rocket.second_stage.payloads[0].payload_mass_kg != null ? `<li><d class="detail">Payload Weight: </d> 
											${launches[l].rocket.second_stage.payloads[0].payload_mass_kg}kg (${launches[l].rocket.second_stage.payloads[0].payload_mass_lbs}lbs) </li>`:''}





										</ul>
										<span class="vd"></span>
										<ul class="col right">
											${launches[l].rocket.first_stage.cores[0].reused != null?
											`<li><d class="detail">${launches[l].rocket.first_stage.cores[0].reused?'First Stage Reused': 'New First Stage'}</d></li>`:''}

											${launches[l].rocket.first_stage.cores[0].reused ?
											`<li><d class="detail">First Stage flight #</d>${launches[l].rocket.first_stage.cores[0].flight}</li>` : 'First Stage Maiden Flight'}


											${launches[l].rocket.first_stage.cores[0].land_success != null?`<li><d class="detail">Landing </d>${launches[l].rocket.first_stage.cores[0].land_success?"Successful":"Unsuccessful"}</li>`:''}

											${launches[l].rocket.first_stage.cores[0].landing_vehicle != null ? `<li><d class="detail">Landing Place:</d> ${launches[l].rocket.first_stage.cores[0].landing_vehicle}</li>`:''}

											${launches[l].rocket.second_stage.fairings != null?
											`<li><d class="detail">Fairing Recovery</d> ${launches[l].rocket.second_stage.fairings.recovered?
											'Successful':'Unsuccessful'} </li>`:''}
										</ul>
									</div>`;

			var eleme = document.createElement("li");
			eleme.innerHTML = launchTemplate;
			eleme.setAttribute("class", "launch");
			if(launches[l].launch_date_unix > Math.round((new Date()).getTime()/1000))
			{
				eleme.setAttribute("class", "launch future");
			}
			if(launches[l].launch_success == false && launches[l].launch_date_unix < Math.round((new Date()).getTime()/1000)){
				eleme.setAttribute("class", "launch failure");
			}
			launchesDOM.appendChild(eleme);
	}
	
}

function getStats(){
	for(var i =0; i<launches.length;i++){
		if(launches[i].launch_success){
			successLaunches++;
		}
		for(var c=0;c<launches[i].rocket.first_stage.cores.length;c++)
		{
			if(launches[i].rocket.first_stage.cores[c].land_success ==true && launches[i].rocket.first_stage.cores[c].land_success != null && launches[i].rocket.first_stage.cores[c].landing_type!="Ocean"){
				successLandings++;
			}
			
			if(launches[i].rocket.first_stage.cores[c].reused)
			{
				reflownCores++;
			}
		}
	}
	console.log(successLaunches + " | " + successLandings);
}

function countdown(nextLaunch){
	var timeNow = Math.round((new Date()).getTime());
	var nextLaunchDate = nextLaunch*1000;
	diff = nextLaunchDate - timeNow;
	function pad(num) {
		return num > 9 ? num : '0'+num;
	  };
	setInterval(function(){
		diff -= 1000;
		days = Math.floor( diff / (1000*60*60*24) );
		hours = Math.floor( diff / (1000*60*60) );
		mins = Math.floor( diff / (1000*60) );
		secs = Math.floor( diff / 1000 );
		dd = days;
		hh = hours - days * 24;
		mm = mins - hours * 60;
		ss = secs - mins * 60;
		document.getElementById("timer").innerHTML=(dd + ' Days ' +
            pad(hh) + ' Hours ' +
            pad(mm) + ' Minutes ' +
            pad(ss) +' Seconds');
		
		if(pad(mm) < 60){
			
		}
		
	},1000);
	
}

