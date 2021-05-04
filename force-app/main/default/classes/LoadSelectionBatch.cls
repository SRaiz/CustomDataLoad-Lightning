/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 4th May, 2021
    @Project        : Data Load - Lightning
    @Description    : This batch class helps in managing the actual data load in salesforce.
*/
public class LoadSelectionBatch implements Database.Batchable<sObject>, Database.Stateful {
    List<sObject> sObjToLoad = new List<sObject>();
    String objectName;

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Constructor
        @Params         : String objName, List<sObject> sObjList
        @Return         : None
    */
    public LoadSelectionBatch( String objName, List<sObject> sObjList ) {
        this.sObjToLoad = sObjList;
        this.objectName = objName;
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Start method of the batch class returns the object list from constructor itself
        @Params         : Database.BatchableContext bc
        @Return         : List<sObject>
    */
    public List<sObject> start( Database.BatchableContext bc ) {
        return sObjToLoad;
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Execute method of the batch class to do the dml required
        @Params         : Database.BatchableContext bc , List<sObject> objList
        @Return         : None
    */
    public void execute( Database.BatchableContext bc , List<sObject> objList ) {
        try {
            if ( String.isNotBlank( objectName ) && 'Contact'.equals( objectName )) {
                upsert objList;
            }
            //-- Add more objects conditions as required --//
        } catch( Exception ex ) {
            System.debug('Exception Occurred :: '+ex.getMessage());
        }
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Finish method of the batch class to do the dml required
        @Params         : Database.BatchableContext bc
        @Return         : None
    */
    public void finish( Database.BatchableContext bc ) {
        //-- Send email for the success and errors --//
    }
}