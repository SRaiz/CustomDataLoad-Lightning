({
    callWithPromise : function(component, event, helper) {
        let parameters = event.getParam('arguments');
        let action = parameters.action;
        let params = parameters.inputParams;

        return new Promise( $A.getCallback(function(resolve, reject){
			if (params) {
				action.setParams(params);
			}
			action.setCallback(this, function(response){
				let error = response.getError();
				let result = response.getReturnValue();

				if (error && error.length > 0) {
					reject(error);
				} 
				else {
					resolve(result);
				}
			});
			$A.enqueueAction(action, false);
		}));
    }
})