({
    handleLoadChange : function(component, event, helper) {
        const loadPickType = component.get('v.loadValues.LoadType__c');
        /** 
         *  Fire the component event to be handled in progress bar component for getting the
         *  selected load value
        */  
        let loadValueEvent = component.getEvent('sendLoadValueToParent');
        loadValueEvent.setParams({
            title : 'SendLoadValueToProgressBar',
            data : {
                selectedPicklistVal : loadPickType
            }
        });
        loadValueEvent.fire();
    }
})