public with sharing class AccountSummaryPromptExtension {

    // Invocable Method of CapabilityType 'FlexTemplate' & that it Matches API Name of template
    @InvocableMethod(CapabilityType='FlexTemplate://Account_Executive_Summary_w_Apex') 
    public static List<Response> getPrompt(List<Request> requests) {
      Request input = requests[0];
      List<Response> responses = new List<Response>();

      Response output = new Response();
      // Grounding the prompt with Salesforce data
      output.Prompt = '\n Related Cases:';
      output.Prompt += '\n ' + JSON.serialize([Select ID, Subject, Description, Status, CaseNumber From Case Where AccountId = :input.Account.Id]);
      output.Prompt += '\n ';
      output.Prompt += '\n Related Contacts:';
      output.Prompt += '\n ' + JSON.serialize([Select ID, Name, Title From Contact Where AccountId = :input.Account.Id]);

      responses.add(output);
      return responses;
    }
    
    // Type and Name of all variables must match as defined when creating the template
    public class Request {
      @InvocableVariable
      public Account Account;
    }
  
    public class Response {
      @InvocableVariable(required=true)
      public String Prompt;
    }

}