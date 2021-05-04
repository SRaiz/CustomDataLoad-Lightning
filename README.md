# Introduction: 

Now that you’ve landed here, I want to tell you that you can use this project to do a custom data load for your salesforce objects in salesforce lightning. **The best this with this project is that it provides you to load any number of data in salesforce without using data loader with chunking being done at UI level.** 

## Next Steps?

- Once you deploy the changes, there will be a custom metadata type named 'Monthly_Load__mdt' created in salesforce
- Make sure to create the records for the objects for which you want to create a data load.
- Initially the **LoadType__c** field will be having two predefined values namely 'Account' and 'Contact'.
- Make sure to add the **API NAME** of the object for which you want to create a data load in this field.
- In the **FieldName__c** field, add the name of the fields for the corresponding object which you want to come in csv template. Add them separated by comma.
- In the **FieldAPIName__c** field, add the api name of the fields for the corresponding object in the same order as done in **FieldName__c**. Add them separated by comma.
- There is also the provision for giving out certain number of rows to the batch from the UI itself. This can be configured by using a custom label named **'Load_Size'**. The value in this is going to take those many number of rows to pass as a batch from UI itself.

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
