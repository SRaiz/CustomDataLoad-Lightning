({
	handleFilesUpload : function (component, event) {  
        const uploadedFiles = event.getParam('files');

        if ( uploadedFiles.length > 0 ) {
            component.set('v.fileName', uploadedFiles[0].name);
            let uploadActiveCmpEvent = component.getEvent('makeUploadButtonActive');
            
            uploadActiveCmpEvent.setParams({
                'title' : 'MakeUploadButtonActiveEvent',
                'data' : uploadedFiles[0]
            }); 
            uploadActiveCmpEvent.fire();
        }
    }
})