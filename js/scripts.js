$(function(){
  console.log('scripts loaded');

  var myKey = config.MY_KEY;
  var url = 'https://developers.zomato.com/api/v2.1/search?entity_id=119518&entity_type=subzone&q=Franklin%20St&sort=rating&apikey=' + myKey;
  var url2 = 'https://developers.zomato.com/api/v2.1/search?entity_id=119518&entity_type=subzone&q=Franklin%20St&start=20&sort=rating&apikey='+ myKey;
  var url3 = 'https://developers.zomato.com/api/v2.1/search?entity_id=119518&entity_type=subzone&q=Franklin%20St&start=40&sort=rating&apikey='+ myKey;
  var url4 = 'https://developers.zomato.com/api/v2.1/search?entity_id=119518&entity_type=subzone&q=Franklin%20St&start=60&sort=rating&apikey='+ myKey;
  var url5 = 'https://developers.zomato.com/api/v2.1/search?entity_id=119518&entity_type=subzone&q=Franklin%20St&start=80&sort=rating&apikey='+ myKey;
  var urlArray = [url, url2, url3, url4, url5];
  var data = [];
  var html = '';
  var i = '';

  for (i = 0; i < urlArray.length; i++) {
    $.ajax({
      type: 'GET',
      url: urlArray[i],
      dataType: 'json',
      async: true,
      data: data,
      success: function(data){
        console.log(data);
      }
    });
  }
});
