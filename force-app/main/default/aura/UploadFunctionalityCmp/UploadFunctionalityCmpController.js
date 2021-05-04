({
    doInit : function(component, event, helper) {   
        //-- Call the controller method for getting the record id of the defalut load contact. This contact will be used for attaching files --//
        let promiseCmp = component.find('promiseService');
        
        let action = component.get('c.getDefaultLoadContactId');
        let params = {
            'contactName' : 'File Upload Contact - DO NOT DELETE'
        };
        promiseCmp.callWithPromise(action, params).then((response) => {
            component.set('v.defaultLoadContactId', response);
        });

        //-- Get the data for custom monthly load --//
        helper.getAllMonthlyLoadsData(component);
        component.set('v.totalRecordsToProcess', parseInt($A.get('$Label.c.Load_Size')));
        component.set('v.loaded', true);
    },

    handleSendLoadToParentEvent : function(component, event, helper) {
        let eventName = event.getParam('title');
        
        if (eventName === 'SendLoadValueToProgressBar') {
            const selectedPicklistValue = event.getParam('data').selectedPicklistVal;
            component.set('v.selectedLoadType', selectedPicklistValue);
        }
    },

    doChangeLoadType : function(component, event, helper) {
        const selectedLoadVal = component.get('v.selectedLoadType');
        const defaultLoadVals = component.get('v.defaultLoadValues');
        const headerFieldsForSelectedValues = defaultLoadVals[selectedLoadVal];
        component.set('v.colList', headerFieldsForSelectedValues['field_label'].split(','));
        
        //-- Create Header Field Name To Api Name Mapping for sending API name to Salesforce Apex --//
        const headerLabelToApi = {};
        headerFieldsForSelectedValues.field_label.split(',').forEach( (field_label, index) => {
            headerLabelToApi[field_label] = headerFieldsForSelectedValues.field_api_name.split(',')[index];
        });
        component.set('v.headerNameToApiMapping', headerLabelToApi);
    },

    handleNext : function(component, event, helper) {
        //-- If there is no selected load type show error that user needs to select one to proceed --//
        const selctdLoadType = component.get('v.selectedLoadType');
        if ( selctdLoadType === '' ) {
            let notifLibTag = component.find('notifLib');
            notifLibTag.showToast({
                'variant' : 'error',
                'title' : 'Select a Load Type',
                'message' : 'Please select a load type to go ahead.'
            });
            return;
        }

        const currentStep = component.get('v.selectedStep');

        if ( currentStep !== undefined && currentStep !== '3' ) {
            component.set('v.selectedStep', String( parseInt(currentStep) + 1 ));
        }
    },

    handleBack : function(component, event, helper) {
        const currentStep = component.get('v.selectedStep');

        if ( currentStep !== undefined && currentStep !== '1' ) {
            component.set('v.selectedStep', String( parseInt(currentStep) - 1 ));
        }

        if ( currentStep !== undefined && currentStep === '3' ) {
            component.set('v.disableUploadBtn', true);
        }
    },

    downloadCsv : function(component, event, helper) {
        let recordsList = component.get('v.colList');

        let csv = helper.convertListToCSV(recordsList);
        if (csv === null){
            return;
        }

		let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self';
        hiddenElement.download = 'SampleFile'+'.csv'; 
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
    },

    handleMakeUploadButtonActiveEvent : function(component, event, helper) {
        let eventName = event.getParam('title');
        
        if (eventName === 'MakeUploadButtonActiveEvent') {
            component.set('v.disableUploadBtn', false);
            const contentDId = event.getParam('data').documentId;
            component.set('v.contentDocumentId', contentDId);
        }
    },

    loadCSVDataToSF : function(component, event, helper) {
        component.set('v.loaded', false);
        helper.getContentVersionForFile(component, helper, component.get('v.contentDocumentId'));
    },

    processCSVBatch : function(component, event, helper) {
        let currentBatchSize = component.get('v.currentBatchSize');
        let startIndex = component.get('v.startIndex');
        let allObjRecords = component.get('v.allCsvRecordsToUpload');
        let notifLibTag = component.find('notifLib');

        if ( currentBatchSize > 0 ) {
            let objArrayTemp = [];
            let tempIndex = 0;

            for ( var i = startIndex; i < startIndex+component.get('v.totalRecordsToProcess') && i < allObjRecords.length; i++ ) {
                objArrayTemp[tempIndex++] = allObjRecords[i];
            }

            let objRecordJSON = JSON.stringify(objArrayTemp);
            component.set('v.uploadJsonString', objRecordJSON);
            helper.uploadCSVRecordsToDatabase(component, currentBatchSize, startIndex);
        }
        else {
            component.set('v.loaded', true);
            component.set('v.startIndex', 0);
            component.set('v.currentBatchSize', 0);
            component.set('v.disableUploadBtn', true);
            notifLibTag.showToast({
                'variant' : 'success',
                'message' : 'The data load is done successfully.'
            });
        }
    }
})