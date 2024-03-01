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

    handleClick() {
        this.isLoading = true;
        console.log("handleClick() is working !");
        //wire service to get the Account details
        console.log("this.recordId " + this.recordId);
        generate({ accountId: this.recordId })
            .then((result) => {
                this.isLoading = false;
                this.aeSummaryBody = result;
                console.log("this.aeSummaryBody is :");
                console.log(this.aeSummaryBody);
                console.log("generate() working !");
                this.isSummaryGenerated = true;
            })
            .catch((error) => {
                this.error = error;
                console.log("not working !")
                this.isLoading = false;
            });
    }

    handleToggleChange(event) {
        if (event.target.checked) {
            this.isPreview = false;
            console.log("Toggle change : False : " + this.isPreview);
        } else {
            this.isPreview = true;
            console.log("Toggle change : True : " + this.isPreview);
        }
    }

    handleSummaryChange(event){
        // handleChange in Slack / Email / Field
        this.aeSummaryBody = event.target.value;
        console.log("this changed value " + this.aeSummaryBody);
    }
    
    handlePublish(){
        // handleChange in Slack / Email / Field
        console.log("publish this value in Slack / Email / Field " + this.aeSummaryBody);

        const fields = {};
        fields['Id'] = this.recordId; //populate it with current record Id
        fields['AI_Generated_AE_Summary_using_APEX__c'] = this.aeSummaryBody; //populate any fields which you want to update like this
        
        const recordInput = { fields };
        console.log(" constant record Input : " + recordInput);
        updateRecord(recordInput) 
            .then(() => {
                    this.dispatchEvent(
                            new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Published Executive Summary to the Accoun team',
                                    variant: 'success',
                            }),
                            // Display fresh data in the form
                            // return refreshApex(this.account);
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
        console.log("PUBLISHING !!!");
    }

}
