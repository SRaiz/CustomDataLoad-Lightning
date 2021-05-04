/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 4th May, 2021
    @Project        : Data Load - Lightning
    @Description    : This controller class helps in managing the actual data load in salesforce using batch apex.
*/
public class LoadSelectionController {

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Get the default contact with name File Upload Contact - DO NOT DELETE for attaching files to process
        @Params         : String contactName
        @Return         : String
    */
    @AuraEnabled
    public static string getDefaultLoadContactId( String contactName ) {
        return [ SELECT Id From Contact WHERE Name =: contactName LIMIT 1 ].Id;
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Get the latest contentversion base64 encoded data from latest file on the contact
        @Params         : String contentDocId
        @Return         : String
    */
    @AuraEnabled
    public static String retrieveBlobDataForFile( String contentDocId ) {

        if ( String.isNotBlank( contentDocId )) {
            ContentVersion docContentVersion = [
                SELECT Id, ContentDocumentId, Title, VersionNumber, IsLatest, VersionData 
                FROM ContentVersion
                WHERE contentDocumentId =: contentDocId AND IsLatest = TRUE
                LIMIT 1
            ];
            if ( docContentVersion != null ) {
                return EncodingUtil.base64Encode(docContentVersion.VersionData);
            }
        }
        return null;
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Get all the monthly load metadata type records for processing the data load
        @Params         : None
        @Return         : List<Monthly_Load__mdt>
    */
    @AuraEnabled
    public static List<Monthly_Load__mdt> getAllMonthlyLoads() {
        return Monthly_Load__mdt.getAll().values();
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Get the object json from UI and then process them in salesforce for batch load
        @Params         : String objectName, String objectJsonStr
        @Return         : None
    */
    @AuraEnabled
    public static void doFinalDataLoad( String objectName, String objectJsonStr ) {
        if ( String.isNotBlank( objectJsonStr )) {
            if ( 'Contact'.equalsIgnoreCase( objectName )) {
                List<Contact> conList = (List<Contact>) JSON.deserialize(objectJsonStr, List<Contact>.class);
                runDataLoadBatch( 'Contact', conList );
            }
            //-- Add else if conditions for all the other objects for which you want to do data load --//
        }
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 4th May, 2021
        @Description    : Run the batch class for dml operations on the object
        @Params         : String objectName, List<sObject> sObjList
        @Return         : None
    */
    private static void runDataLoadBatch( String objectName, List<sObject> sObjList ) {
        LoadSelectionBatch loadSelBatch = new LoadSelectionBatch( objectName , sObjList );
        Database.executeBatch( loadSelBatch , 200 );
    }
}