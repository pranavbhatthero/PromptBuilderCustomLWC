import { LightningElement, api } from 'lwc';
import generate from '@salesforce/apex/AccountSummaryGeneration.generate';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class AccountExecutiveSummaryCustomAPEX extends LightningElement {

    @api recordId;
    aeSummaryBody = '';
    isLoading = false;
    isSummaryGenerated = false;
    isPreview = true;

    // "Generate Account Executive Summary" Button Click
    handleClick() {
        this.isLoading = true;
        // wire service to get the Account details
        generate({ accountId: this.recordId })
            .then((result) => {
                this.isLoading = false;
                this.aeSummaryBody = result;
                this.isSummaryGenerated = true;
            })
            .catch((error) => {
                this.error = error;
                this.isLoading = false;
            });
    }

    // "Edit Summary" On/Off toggle
    handleToggleChange(event) {
        if (event.target.checked) {
            this.isPreview = false;
        } else {
            this.isPreview = true;
        }
    }

    // Track changes made while Editing the Generated Summary
    handleSummaryChange(event){
        this.aeSummaryBody = event.target.value;
    }

    // Can be published anywhere, publish to Salesforce in this use case
    handlePublish(){

        // create fields to be populated with data
        const fields = {};
        fields['Id'] = this.recordId; //populate it with current record Id
        fields['AI_Generated_AE_Summary_using_APEX__c'] = this.aeSummaryBody; //populate any fields which you want to update like this
        
        // feed recordInput, used to update Salesforce Record
        const recordInput = { fields };
        updateRecord(recordInput) 
            .then(() => {
                    this.dispatchEvent(
                            new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Published Executive Summary to the Accoun team',
                                    variant: 'success',
                            }),
                            // Can display fresh data back if needed refreshApex(this.account);
                    );
            }) 
            .catch(error => {
                    this.dispatchEvent(
                            new ShowToastEvent({
                                    title: 'Error creating record',
                                    message: 'Failed to Publish',
                                    // message: error.body.message,
                                    variant: 'error',
                            }),
                    );
            });
        this.aeSummaryBody = '';
        this.isSummaryGenerated = false;
    }

}
