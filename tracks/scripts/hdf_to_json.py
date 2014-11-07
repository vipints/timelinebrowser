#!/usr/bin/env python 
"""
clinical data from hdf5 form to json for displaying 
"""

import json 
import pandas as pd 
import numpy

def pretty(s):
    s=list(str.lower(s))
    for i in range(len(s)-1):
        if s[i]==' ':
            s[i+1]=str.lower(s[i+1])
        if i==0:
            s[i]=str.upper(s[i])

    return ''.join(s)

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

order_records = pd.read_hdf(h5_fname, "BR_ORDER_SAMPLE")
emr_records = pd.read_hdf(h5_fname, "BR_EMR_SAMPLE")

track_name_id=dict()
track_name_cnt=dict()
ptids=set(order_records['ORD_PT_DEIDENTIFICATION_ID'])
sort_index=0
for i in ptids:

    patient_1_rec = emr_records[emr_records['EMR_PT_DEIDENTIFICATION_ID'] == i]

    for count, row in patient_1_rec.iterrows():
        rec = init_rec()
        rec['eventType'] = row['EMR_CATEGORY'].strip( ' ' ).strip('.')
        tn=rec['eventType'] + ' ' + pretty(row['EMR_DESC'].strip( ' ' ))+' ('+row['EMR_DOCTYPE'].strip(' ')+')'
        if not track_name_id.has_key(tn):
            track_name_id[tn]=sort_index
            track_name_cnt[tn]=0
            sort_index+=1
        track_name_cnt[tn]+=1
last_emr=sort_index

for i in ptids:
    patient_1_rec = order_records[order_records['ORD_PT_DEIDENTIFICATION_ID'] == i]

    for count, row in patient_1_rec.iterrows():
        tn=row['ORD_TYPE_CD'].strip(' ')+' '+row['ORD_NAME'].strip( ' ' ).strip('.')
        if not track_name_id.has_key(tn):
            track_name_id[tn]=sort_index
            track_name_cnt[tn]=0
            sort_index+=1
        track_name_cnt[tn]+=1

for i in track_name_id:
    if track_name_cnt[i]>=200:
        print '<input type="checkbox" checked>%s</br>' % i

        
display_thresh=200
ptids=set(order_records['ORD_PT_DEIDENTIFICATION_ID'])
for i in ptids:

    # small order_records 
    #patient_1_rec = order_records[order_records['ORD_PT_DEIDENTIFICATION_ID'] == 1033138]

    # large order_records  
    #patient_1_rec = order_records[order_records['ORD_PT_DEIDENTIFICATION_ID'] == 993384]

    data = [] 
    counter = 1
    sort_index=0;

    patient_1_rec = emr_records[emr_records['EMR_PT_DEIDENTIFICATION_ID'] == i]

    for count, row in patient_1_rec.iterrows():

        rec = init_rec()

        rec['eventId'] = counter 
        counter += 1 

        rec['patientId'] = row['EMR_PT_DEIDENTIFICATION_ID']
        rec['eventType'] = row['EMR_CATEGORY'].strip( ' ' ).strip('.')
        rec['startDate'] = row['EMR_DAYS_SINCE_MRN_CREATE_DTE']
        rec['eventData'] = rec['eventType'] + ' ' + pretty(row['EMR_DESC'].strip( ' ' ))+' ('+row['EMR_DOCTYPE'].strip(' ')+')'
        rec['sortIndex'] = track_name_id[rec['eventData']]
        rec['eventMon'] = row['EMR_MONTH_NAME']
        rec['eventYear'] = row['EMR_YEAR']
        rec['summary'] = row['EMR_MONTH_NAME']+' '+str(row['EMR_YEAR'])+','+rec['eventData']

        sort_index+=1
        
        data.append(rec) 

    patient_1_rec = order_records[order_records['ORD_PT_DEIDENTIFICATION_ID'] == i]

    for count, row in patient_1_rec.iterrows():

        rec = init_rec()

        rec['eventId'] = counter 
        counter += 1 

        rec['patientId'] = row['ORD_PT_DEIDENTIFICATION_ID']
        rec['eventType'] = row['ORD_TYPE_CD'].strip( ' ' ).strip('.')
        rec['startDate'] = row['ORD_DAYS_SINCE_MRN_CREATE_DTE']
        tn=row['ORD_TYPE_CD'].strip(' ')+' '+row['ORD_NAME'].strip( ' ' ).strip('.')
        rec['eventData'] = tn 
        rec['sortIndex'] = track_name_id[rec['eventData']]
        rec['eventMon'] = row['ORD_MONTH']
        rec['eventYear'] = row['ORD_YEAR']
        rec['summary'] = row['ORD_MONTH']+' '+str(row['ORD_YEAR'])+','+rec['eventData']+','+row['ORD_SET_HEADING'].strip(' ')+','+row['ORD_SET_NAME'].strip(' ')
        sort_index+=1 
        data.append(rec) 


    json_data = json.dumps(data)

    #print json_data 

    json_fn='../static/tracks/tmp/dataset_%i.json' % rec['patientId']
    print json_fn
    fd=open(json_fn, 'w+') ;
    fd.write(json_data)
    fd.close()

emr_idx=(numpy.array(track_name_id.values())<=last_emr).nonzero()
order_idx=(numpy.array(track_name_id.values())>last_emr).nonzero()

A=list(set());
A.sort()

for i in A:
    print '<input type="checkbox">%s</br>' % i
                                              
