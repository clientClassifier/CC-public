//WARNING this version will overide existing values, willl need to add a check to make sure that does not happen

db.loanofficers.find().forEach(
	function(LO){
		LO.clients.forEach(
			function(client){
				var dispute = {
					_id: null,
					type: {
						requestNewLO: null,
						requestDeleteClient: null
					}
				};//end of var dispute

				client.dispute = dispute; 

			}//inside each client
		)//Lo clients for Each

		db.loanofficers.save(LO);

	}//end function LO
);//end of updating



db.realestateagents.find().forEach(
	function(agent){
		agent.clients.forEach(
			function(client){
				var dispute = {
					_id: null,
					type: {
						requestNewLO: null,
						requestDeleteClient: null
					}
				};//end of var dispute

				client.dispute = dispute; 

			}//inside each client
		)//agent clients for Each

		db.realestateagents.save(agent);

	}//end function agent
);//end of updating

