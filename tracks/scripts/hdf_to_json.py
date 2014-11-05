#!/usr/bin/env python 
"""
clinical data from hdf5 form to json for displaying 
"""

import json 
import pandas as pd 

def init_rec():
    
    rec_det = dict(eventId = None,
                patientId = None,
                eventType = None, 
                startDate = None, 
                stopDate = None, 
                eventData = None, 
                eventMon = None, 
                eventYear = None
                ) 

    return rec_det

h5_fname = '/cbio/grlab/clinical/projects/BigData/sandbox_vipin/BREAST_TIMELINE_SAMPLE_PD.h5'

records = pd.read_hdf(h5_fname, "BR_ORDER_SAMPLE")

ptids=set(records['ORD_PT_DEIDENTIFICATION_ID'])
for i in ptids:

    # small records 
    #patient_1_rec = records[records['ORD_PT_DEIDENTIFICATION_ID'] == 1033138]

    # large records  
    #patient_1_rec = records[records['ORD_PT_DEIDENTIFICATION_ID'] == 993384]

    patient_1_rec = records[records['ORD_PT_DEIDENTIFICATION_ID'] == i]

    data = [] 
    counter = 1 
    for count, row in patient_1_rec.iterrows():

        rec = init_rec()

        rec['eventId'] = counter 
        counter += 1 

        rec['patientId'] = row['ORD_PT_DEIDENTIFICATION_ID']
        rec['eventType'] = row['ORD_TYPE_CD'].strip( ' ' )
        rec['startDate'] = row['ORD_DAYS_SINCE_MRN_CREATE_DTE']
        rec['eventData'] = row['ORD_NAME'].strip( ' ' )
        rec['eventMon'] = row['ORD_MONTH']
        rec['eventYear'] = row['ORD_YEAR']

        data.append(rec) 

    json_data = json.dumps(data)

    #print json_data 

    json_fn='../static/tracks/tmp/dataset_%i.json' % rec['patientId']
    print json_fn
    fd=open(json_fn, 'w+') ;
    fd.write(json_data)
    fd.close()
