public with sharing class AccountSummaryGeneration {
    
    @AuraEnabled
    public static String generate(String accountId) {

        // Calling a prompt template from Apex
        ConnectApi.EinsteinPromptTemplateGenerationsInput promptGenerationsInput = new ConnectApi.EinsteinPromptTemplateGenerationsInput();
        
        // Set input parameters
        Map<String, ConnectApi.WrappedValue> inputParams = new Map<String, ConnectApi.WrappedValue>();
        Map<String, Object> accountObjectInput = new Map<String, String>();
        accountObjectInput.put('id', accountId);
        
        // Add wrapped values
        ConnectApi.WrappedValue accountWrappervalue = new ConnectApi.WrappedValue();
        accountWrappervalue.value = accountObjectInput;
        inputParams.put('Input:Account', accountWrappervalue);

        // modifications or configuration for our model / hyperparamenters
        promptGenerationsInput.inputParams = inputParams;
        // promptGenerationsInput.additionalConfig                = new ConnectApi.EinsteinLlmAdditionalConfigInput();
        // promptGenerationsInput.additionalConfig.numGenerations = 1;
        // promptGenerationsInput.additionalConfig.maxTokens      = 10000;
        // promptGenerationsInput.additionalConfig.model          = 'gpt-35-turbo';
        // promptGenerationsInput.additionalConfig.enablePiiMasking  = false;
        // promptGenerationsInput.additionalConfig.applicationName   = 'PromptBuilderPreview';        
        promptGenerationsInput.isPreview = false;

        // call the LLM service through ConnectAPI & consume the response
        return EinsteinGenerativeGatewayService.getPromptTemplateResponse('Account_Executive_Summary_w_Apex', promptGenerationsInput);
    }

}
