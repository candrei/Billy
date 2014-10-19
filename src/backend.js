
function getProjects() {
 
  var url = "https://api.mongolab.com/api/1/databases/billy/collections/projects";
  var apiKey = "9fwz927kh0cPoD_YqdzMLGxZe1TGmYG9";
  
  ajax(
    {
      url: url
      method: 'GET',
      type: 'json',
      data: {apiKey: apiKey},
      async: false
    },
    function(result){ console.log('ajax success: ' + result); },
    function(error){ console.log('ajax failure: ' + error); }
  );
}