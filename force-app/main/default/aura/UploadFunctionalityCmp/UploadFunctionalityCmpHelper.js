({
    convertListToCSV : function( objectRecords ) {
       	if (objectRecords === null || !objectRecords.length) {
            return null;
        }
        
        let header = objectRecords.join(',');
        let csv = header;
        return csv;
    },

    getContentVersionForFile : function(component, helper, contentDId) {
        let promiseCmp = component.find('promiseService');
        
        let action = component.get('c.retrieveBlobDataForFile');
        let params = {
            'contentDocId' : contentDId,
        };

        promiseCmp.callWithPromise(action, params).then( (response) => {
            if ( response ) {
                let blobVal = new Blob([response], {type: 'text/csv'});
                let reader = new FileReader();
                reader.onload = function (evt) {
                    let csv = atob(evt.target.result);
                    let headers = helper.getCsvHeader(component, csv);
                    const colList = component.get('v.colList');
                    const isSameHeader = helper.checkIfArraysAreSame(headers, colList);
                    if ( isSameHeader === false ) {
                        let notifLibTag = component.find('notifLib');
                        notifLibTag.showToast({
                            'variant' : 'error',
                            'title' : 'Upload Correct File',
                            'message' : 'Please upload a correct file to continue.'
                        });
                        return;
                    }
                    else {
                        //-- If everything is good lets try to upsert the data --//
                        helper.doDataUpload(component, helper, csv);
                    }
                }
                reader.onerror = function (evt) {
                    console.log(evt);
                }
                reader.readAsText(blobVal, "UTF-8");
            }
        });
    },

    getCsvHeader : function (component, csv) {
        let arr = []; 
        arr = csv.split('\r\n');
        let headers = arr[0].split(',');
        return headers;        
    },

    checkIfArraysAreSame : function(array1, array2) {
        return JSON.stringify(array1) === JSON.stringify(array2);
    },

    getAllMonthlyLoadsData : function(component) {
        let promiseCmp = component.find('promiseService');
        
        let action = component.get('c.getAllMonthlyLoads');
        promiseCmp.callWithPromise(action).then( (response) => {
            const loadMap = [];
            const defaultLoadFields = {}

            response.forEach( (mData) => {
                loadMap.push({
                    key : mData.LoadType__c, 
                    value : mData.LoadType__c
                });
                defaultLoadFields[mData.LoadType__c] = {
                    field_label : mData.FieldName__c,
                    field_api_name : mData.FieldAPIName__c
                };
            });
            component.set('v.loadMapValues', loadMap);
            component.set('v.defaultLoadValues', defaultLoadFields);
        });
    },

    doDataUpload : function(component, helper, textFromFileLoaded) {
        
        let finalResult = helper.CSVToArray( textFromFileLoaded, ',');
        let objColumnArray = [];
        let headerColumns = finalResult[0];
        const headerApiNameMap = component.get('v.headerNameToApiMapping');

        headerColumns.forEach( (colName) => {
            objColumnArray.push(headerApiNameMap[colName]);
        });

        let allObjRecords = [];
        finalResult.forEach((data, index) => {
            if (index > 0) {
                let dataRow = data;
                let objectRecord = {};
                objColumnArray.forEach((colName, index) => {
                    objectRecord[colName] = dataRow[index];
                });

                if (dataRow.length === headerColumns.length) {
                    allObjRecords.push(objectRecord);
                }
            }
        });
        /** 
         *  Add all the csv records to upload for the object over here
         *  Plan is to get them and then send only chunks to upload at a time.
        */
        component.set('v.allCsvRecordsToUpload', allObjRecords);

        //-- Create a batch for inserting the records in a batch of 1000 records --//
        let batchSize = Math.ceil( allObjRecords.length / component.get('v.totalRecordsToProcess') );
        component.set('v.currentBatchSize', batchSize);
    },

    CSVToArray : function ( strData ) {
        const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
        let arrMatches = null, arrData = [[]];
        while (arrMatches = objPattern.exec(strData)) {
            if ( arrMatches[1].length && arrMatches[1] !== "," ) {
                arrData.push([]);
            }
            arrData[arrData.length - 1].push(arrMatches[2] ? arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") : arrMatches[3]);
        }
        return arrData;
    },

    uploadCSVRecordsToDatabase : function(component, currentBatchSize, startIndex) {
        let objToUploadJson = component.get('v.uploadJsonString');

        let promiseCmp = component.find('promiseService');
        let action = component.get('c.doFinalDataLoad');
        let params = {
            objectName : component.get('v.selectedLoadType'),
            objectJsonStr : objToUploadJson
        };

        promiseCmp.callWithPromise(action, params).then( (response) => {
            component.set('v.startIndex', startIndex + component.get('v.totalRecordsToProcess'));
            component.set('v.currentBatchSize', currentBatchSize - 1);
        });
    }
})