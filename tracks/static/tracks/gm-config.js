/**
 * This is a configuration file.
 * Changes to this file may cause the application does not work as it should
 *
 * Default hosts
 * CELLBASE_HOST = "http://usa.cellbase.org:8080/cellbase/rest";
 * CELLBASE_HOST = "http://ws.bioinfo.cipf.es/cellbase/rest";
 * OPENCGA_HOST = "http://ws.bioinfo.cipf.es/gcsa/rest";
 *
 * Deprecated hosts
 * WUM_HOST = "http://ws.bioinfo.cipf.es/wum/rest";
 *
 **/
//CELLBASE_VERSION = "v3";
//CELLBASE_HOST = "http://ws.bioinfo.cipf.es/cellbase/rest";
//CELLBASE_HOST = "http://www.ebi.ac.uk/cellbase/webservices/rest";
//OPENCGA_HOST = "http://ws.bioinfo.cipf.es/opencga/rest";
//OPENCGA_LOCALHOST = "http://localhost:61976/opencga/rest";

/** Devel only: custom URL check **/
/**
if (
    window.location.host.indexOf("localhost") != -1 ||
        window.location.host.indexOf("fsalavert") != -1 ||
        window.location.host.indexOf("rsanchez") != -1 ||
        window.location.host.indexOf("imedina") != -1 ||
        window.location.href.indexOf("http://bioinfo.cipf.es/apps-beta") != -1 ||
        window.location.protocol === "file:"
    ) {


    OPENCGA_HOST = "http://ws-beta.bioinfo.cipf.es/opencga-staging/rest";
}
**/

/*Panel settings*/
CONFPANELHIDDEN = false;
REGIONPANELHIDDEN = true;
/**/

var POPULAR_SPECIES = ["Homo sapiens", "Mus musculus"];

var AVAILABLE_SPECIES = {
    "text": "Species",
    "items": [
        {
            "text": "Vertebrates",
            "items": [
                {"text": "Homo sapiens", "assembly": "GRCh37.p10", "region": {"chromosome": "13", "start": 32889611, "end": 32973805}, "chromosomes": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "X", "Y", "MT"]},
                {"text": "Homo sapiens", "assembly": "GRCh37.p10", "region": {"chromosome": "13", "start": 32889611, "end": 32973805}, "chromosomes": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "X", "Y", "MT"], "url": "ftp://ftp.ensembl.org/pub/release-71/"},
                {"text": "Mus musculus", "assembly": "GRCm38.p1", "region": {"chromosome": "1", "start": 18422009, "end": 18422009}, "chromosomes": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "X", "Y", "MT"], "url": "ftp://ftp.ensembl.org/pub/release-71/"}
            ]
        }
    ]
};

/** Reference to a species from the list to be shown at start **/
var DEFAULT_SPECIES = AVAILABLE_SPECIES.items[0].items[0];

var SPECIES_TRACKS_GROUP = {

    "hsapiens": "group1",
    "mmusculus": "group1",

    "hsa": "group1",
    "mmu": "group2"
};

var TRACKS = {"group1": [
    {"category": "Core",
        "tracks": [
//					          {"id":"Cytoband", "disabled":false, "checked":true},
            {"id": "Sequence", "disabled": false, "checked": true},
            {"id": "Gene/Transcript", "disabled": false, "checked": true},
            {"id": "CpG islands", "disabled": true, "checked": false}
        ]
    },
    {"category": "Variation",
        "tracks": [
            {"id": "SNP", "disabled": false, "checked": true},
            {"id": "Mutation", "disabled": true, "checked": false},
            {"id": "Structural variation (<20Kb)", "disabled": true, "checked": false},
            {"id": "Structural variation (>20Kb)", "disabled": true, "checked": false}
        ]
    },
    {"category": "Regulatory",
        "tracks": [
            {"id": "TFBS", "disabled": false, "checked": false},
            {"id": "miRNA targets", "disabled": false, "checked": false},
//			                  {"id":"Histone", "disabled":false, "checked":false},
//			                  {"id":"Polymerase", "disabled":false, "checked":false},
//			                  {"id":"Open Chromatin", "disabled":true, "checked":false},
            {"id": "Conserved regions", "disabled": false, "checked": false}
        ]
    }
],
    "group2": [
        {"category": "Core",
            "tracks": [
//					          {"id":"Cytoband", "disabled":false, "checked":true},
                {"id": "Sequence", "disabled": false, "checked": true},
                {"id": "Gene/Transcript", "disabled": false, "checked": true},
                {"id": "CpG islands", "disabled": true, "checked": false}
            ]
        },
        {"category": "Variation",
            "tracks": [
                {"id": "SNP", "disabled": true, "checked": true},
                {"id": "Mutation", "disabled": true, "checked": false},
                {"id": "Structural variation (<20Kb)", "disabled": true, "checked": false},
                {"id": "Structural variation (>20Kb)", "disabled": true, "checked": false}
            ]
        },
        {"category": "Regulatory",
            "tracks": [
                {"id": "TFBS", "disabled": true, "checked": false},
                {"id": "miRNA targets", "disabled": true, "checked": false},
                {"id": "Histone", "disabled": true, "checked": false},
                {"id": "Polymerase", "disabled": true, "checked": false},
                {"id": "Open Chromatin", "disabled": true, "checked": false},
                {"id": "Conserved regions", "disabled": true, "checked": false}
            ]
        }
    ],
    "group3": [
        {"category": "Core",
            "tracks": [
//					          {"id":"Cytoband", "disabled":false, "checked":true},
                {"id": "Sequence", "disabled": false, "checked": true},
                {"id": "Gene/Transcript", "disabled": false, "checked": true},
                {"id": "CpG islands", "disabled": true, "checked": false}
            ]
        },
        {"category": "Variation",
            "tracks": [
                {"id": "SNP", "disabled": true, "checked": false},
                {"id": "Mutation", "disabled": true, "checked": false},
                {"id": "Structural variation (<20Kb)", "disabled": true, "checked": false},
                {"id": "Structural variation (>20Kb)", "disabled": true, "checked": false}
            ]
        },
        {"category": "Regulatory",
            "tracks": [
                {"id": "TFBS", "disabled": true, "checked": false},
                {"id": "miRNA targets", "disabled": true, "checked": false},
                {"id": "Histone", "disabled": true, "checked": false},
                {"id": "Polymerase", "disabled": true, "checked": false},
                {"id": "Open Chromatin", "disabled": true, "checked": false},
                {"id": "Conserved regions", "disabled": true, "checked": false}
            ]
        }
    ]
};

