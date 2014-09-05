/**
 * This is a configuration file.
 * Changes to this file may cause the application does not work as it should
 *
 **/

//CELLBASE_HOST = "http://localhost/cellbase/rest";
//OPENCGA_HOST = "http://localhost/opencga/rest";
OPENCGA_LOCALHOST = "http://localhost:61976/opencga/rest";

/** Devel only: custom URL check **/
if(window.location.host.indexOf("garage.mskcc.org")!=-1 ){

	CELLBASE_HOST = "http://garage.mskcc.org:8081/cellbase/rest";
    OPENCGA_HOST = "http://garage.mskcc.org:8081/opencga/rest";
}

var AVAILABLE_SPECIES = [
                        {	"name":"", "species":"hsa", "icon":"",
							"region":{"patient_id":"1","start":1,"end":12}
						}
                        /**
                        {	"name":"Mus musculus m37", "species":"mmu", "icon":"",
							"region":{"chromosome":"1","start":18422009,"end":18422009}
						},
						**/
                        ];

/** Reference to a species from the list to be shown at start **/
var DEFAULT_SPECIES = AVAILABLE_SPECIES[0];

var SPECIES_TRACKS_GROUP = {"hsa":"group1",
							"mmu":"group2"
							};

var TRACKS ={"group1":[
			          {"category":"Core",
					   "tracks":[
                            {"id":"Specimens", "disabled":false, "checked":true},                                                                     
                            {"id":"Mutations", "disabled":false, "checked":true},
                            {"id":"Reports", "disabled":false, "checked":true},
                            {"id":"Lab Tests", "disabled":false, "checked":true},
                            {"id":"Treatments", "disabled":false, "checked":true}
			                  ]
					  },
					  {"category":"Variation",
					   "tracks":[
			                  {"id":"SNP", "disabled":false, "checked":true},
			                  {"id":"Mutation", "disabled":false, "checked":false},
			                  {"id":"Structural variation (<20Kb)", "disabled":false, "checked":false},
			                  {"id":"Structural variation (>20Kb)", "disabled":false, "checked":false}
			                  ]
					  },
					  {"category":"Regulatory",
					   "tracks":[
					          {"id":"TFBS", "disabled":false, "checked":false},
			                  {"id":"miRNA targets", "disabled":false, "checked":false},
			                  {"id":"Conserved regions", "disabled":false, "checked":false}
			                  ]
					  }
			],
			"group2":[
			          {"category":"Core",
					   "tracks":[
					          {"id":"Sequence", "disabled":false, "checked":true},
					          {"id":"Gene/Transcript", "disabled":false, "checked":true},
			                  {"id":"CpG islands", "disabled":true, "checked":false}
			                  ]
					  },
					  {"category":"Variation",
					   "tracks":[
			                  {"id":"SNP", "disabled":false, "checked":true},
			                  {"id":"Mutation", "disabled":true, "checked":false},
			                  {"id":"Structural variation (<20Kb)", "disabled":true, "checked":false},
			                  {"id":"Structural variation (>20Kb)", "disabled":true, "checked":false}
			                  ]
					  },
					  {"category":"Regulatory",
					   "tracks":[
					          {"id":"TFBS", "disabled":true, "checked":false},
			                  {"id":"miRNA targets", "disabled":true, "checked":false},
			                  {"id":"Histone", "disabled":true, "checked":false},
			                  {"id":"Polymerase", "disabled":true, "checked":false},
			                  {"id":"Open Chromatin", "disabled":true, "checked":false},
			                  {"id":"Conserved regions", "disabled":true, "checked":false}
			                  ]
					  }
			]
};

