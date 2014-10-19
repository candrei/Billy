
function getProjects() {
 
  var url = "https://api.mongolab.com/api/1/databases/billy/collections/projects";
  var apiKey = "9fwz927kh0cPoD_YqdzMLGxZe1TGmYG9";
  
  ajax(
    {
      url: url
      method: 'GET',
      type: 'json',
      data: {apiKey: apiKey}
    },
    function(e){ console.log('ajax success: ' + e); },
    function(e){ console.log('ajax failure: ' + e); }
  );
}