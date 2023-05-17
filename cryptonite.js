/// <reference path="jquery-3.5.1.js"/>
// cryptonite.js

console.log('cryptonite.js loaded');
var _itemDebug = null;
// var coinsListAddress = "https://api.coingecko.com/api/v3/coins/list";
var coinsListAddress = "resources/SpecialCoinsList.json";
//var bitcoinDetailsAddress = "resources/"; //bitcoin.json"
var bitcoinDetailsAddress = 'https://api.coingecko.com/api/v3/coins/';

var reportsLink = "https://min-api.cryptocompare.com/data/pricemulti";

var reportsStorage = {}; // dictionary
var _collectionCoins = {};

var _cardTemplate = null;

var _infoAboutCoins = null;

var _moreInfoTemplate = null;
var _chartTemplate = null;
var chartCoins = null;
var chartCoinsInterval = null;

var _reportCardTemplate = null;


function GetAllCoins() {

    var _url = coinsListAddress;

    $.get(_url, function(response) {

        //console.log('GetAllCoins: response = ',response);
        let _collection = [];
        response.forEach((item, ind) => {
            if (ind > 99) return true;
            _collection.push(item);
        });
        console.log('GetAllCoins:  _collection= ',_collection);
        _itemDebug = _collection[0];
        _collectionCoins = _collection;
        console.log('GetAllCoins:  _collectionCoins= ',_collectionCoins);
        //Draw(response);
        DrawCards(_collection);
    });
} //GetAllCoins

function ToPage(e) {
    console.log('TooPage:Id = ', e.target.id);
    ClearState();

    switch (e.target.id) {
        case "home":
            GetAllCoins();
            break;
        case "reports":
            Reports();
            break;
        case "about":
            About();
            break;

        default:
            break;
    }

} //TooPage

function ClearState() {
    // reports    
    clearInterval(chartCoinsInterval);
    // chartCoins = null;
}


//function Draw(collection){

//console.log('Draw:collection = ', collection)

//var _container = $(<div/>).class('container');
//_container.html('');

//for(var i = 0; i < collection.lengh; i++){
//var _item = collection[i];
//var _items = GetCard(_item);
//_container.append(_items);
//}

//}// Draw

// return coin-card html-control(jquery) with data from item
function GetCard(item) {
    var _temp = $(_cardTemplate).clone();
    return $.tmpl(_temp, item);
}

function ToggleInfo(btn, coinID) {
    //console.log('ToggleInfo: btn = ', btn, '\ncoinID = ', coinID);

    var _isExpended = $(btn).attr('expended') == 'true';
    console.log('ToggleInfo: _isExpended = ', _isExpended);

    var _elMoreInfo = $(btn).next('.moreinfo');
    console.log('ToggleInfo: _elMoreInfo = ', _elMoreInfo[0]);


    if (!_isExpended) {
        //var _item = { coinID: id }; //var get info by coinId
        //var _info = GetInfo('bitcoin');
        console.log('ToggleInfo: getInfo');
        GetInfo(coinID, function(result) {
            console.log('GetInfo.handler: result = ', result);
            var _info = result;
            var _temp = $(_moreInfoTemplate).clone();
            $.tmpl(_temp, _info).appendTo(_elMoreInfo);

            // insert info to card (.moreinfo) (by _moreInfoTemplate)

        });

    } else {
        _elMoreInfo.html('');

        // clear .moreinfo
        console.log('ToggleInfo: clear info');
    }
    // change expanded
    $(btn).attr('expended', !_isExpended);
}



function DrawCards(collection) {
    console.log('DrawCards: collection = ', collection);
    console.log('DrawCards: collection.length = ', collection.length);
    console.log('DrawCards: reportsStorage = ', reportsStorage);
    // reset
    $('.container').html('');
    //var _btnChecked = $('.custom-control-input');


    collection.forEach(element => {

        // var _temp = $(_cardTemplate).clone();
        // var _template = $.tmpl(_temp, element);
        var _template = GetCard(element);

        // 1. check in reports by id
        //_btnChecked.prop('checked', true);
        var _btnChecked = _template.find('.custom-control-input')
            //console.log('DrawCards: _btnChecked = ', _btnChecked[0], '\nelement.id = ', element.id);

        if (reportsStorage[element.id]) {
            _btnChecked.prop('checked', true);
        };

        _template.appendTo('.container');
    });
}

function DrawReport(storage) {
    console.log('DrawReport: storage = ', storage);

    $('#reportsList').html('');

    for (var key in storage) {
        var _temp = $(_reportCardTemplate).clone();
        var _template = $.tmpl(_temp, storage[key]);
        console.log('DrawReport: _template = ', _template[0]);
        _template.appendTo('#reportsList');
    };
}

function About() {
    //console.log('About: _infoAboutCoins = ', _infoAboutCoins);
    $('.container').html(_infoAboutCoins);
}

function ToggleReport(checkBox, id) {
    //console.log('ToggleReport: id = ', id, '\ncheckBox = ', checkBox);

    if ($(checkBox).is(':checked')) {
        AddReport(id)
    } else {
        DeleteReport(id);
    }
}

function AddReport(id) {
    //console.log('AddReport:id = ', id);
    console.log("AddReports reportsStorage: ",reportsStorage);
    var _popupReports = Object.keys(reportsStorage).length;
    console.log('AddReport:_popupReports =', _popupReports);
    if (_popupReports > 4) {
        OpenReports();
        return;
    }

    var _currItem = GetLocalItemByID(id);
    console.log('AddReport: _currItem = ', _currItem);
    reportsStorage[id] = _currItem;

} //AddReport


function OpenReports() {
    console.log("OpenReports reportsStorage: ",reportsStorage);
    $('.bg_Popup').show();
    DrawReport(reportsStorage);

}

function CloseReports() {
    $('.bg_Popup').hide();
    //refresh items
    GetAllCoins();

}

function DeleteRportCard(btn, id) {
    // console.log('DeleteRportCard: btn = ', btn, '\nid = ', id);

    $(btn).closest('li').remove(); // delete from html

    DeleteReport(id);
}

// get object from html card
function GetLocalItemByID(itemID) {
    var _result = { id: itemID };
    // $('.card[itemid="01coin"]')
    $('.card[itemId="' + itemID + '"]').find('[fieldName]').each(function() {
        // each elem this
        var _fieldName = $(this).attr('fieldName');
        var _value = $(this).text();
        _result[_fieldName] = _value;
    });

    return _result;

    // css [attributeName]
    /*
    $('[itemId="02-token"]').find('[fieldName]').each(function(){
    console.log($(this).attr('fieldName') + ' - ' + $(this).text());
}); */
}

function DeleteReport(id) {
    console.log("DeleteReport reportsStorage: ",reportsStorage);
    console.log('DeleteReport:id = ', id);

    delete reportsStorage[id];

} //DeleteReport



function GetInfo(coinId, handler) {
    console.log('GetInfo: coinId = ', coinId);

    // TODO: check in CACHE

    var _url = 'https://api.coingecko.com/api/v3/coins/' + coinId;
    //bitcoin.json
    // coinId = 'bitcoin';
    // var _url = bitcoinDetailsAddress + coinId + '.json'

    $.get(_url, function(response) {
        //console.log('GetInfo:response = ', response);
        // var _item = response[0];
        handler(response);
    });

}
//GetInfo();

//================================
function GetTemplates() {
    $.get('teamplates/cryptocard.html', {}, function(templateBody) {
        //console.log('GET: templateBody = ', templateBody);
        _cardTemplate = templateBody;
    });

    //////get template for moreInfo
    $.get('teamplates/info.html', {}, function(templateBody) {
        //console.log('GET: templateBody = ', templateBody);
        _moreInfoTemplate = templateBody;
    });

    // $.get('teamplates/graf.html', {}, function(templateBody) {
    //     //console.log('GET: templateBody = ', templateBody);
    //     _chartTemplate = templateBody;
    // });

    // TODO: get template for reports
    // TODO: get template for about
    $.get('teamplates/about.html', {}, function(templateBody) {
        //console.log('GET: templateBody = ', templateBody);
        _infoAboutCoins = templateBody;
    });

    // TODO: get template for popupReports
    $.get('teamplates/ReportCard.html', {}, function(templateBody) {
        //console.log('GET: templateBody = ', templateBody);
        _reportCardTemplate = templateBody;
    });
}

function Reports() {

    // 1. get reports from reportsStorage and build link
    var _url = GetUrlForPrices();
    if (!_url) return;

    // 2. get data from server api
    $.get(_url, function(response) {
        console.log('Reports: response = ', response);
        if (response.Message) {
            console.warn('Reports: ', response.Message);
            return;
        }
        //{"1WO":{"USD":0.08108},"1SG":{"USD":0.1638}}
        var _chartData = GetDataPoints(response);
        //var _daGetUrlForPricestaPoints = GetDataPoints(_coinPoints);
        console.log('Reports: _chartData = ', _chartData);
        DrawGraf(_chartData);
    });

    //#region  for debug
    // var _dataPoints = [{
    //         x: (new Date(2020, 0, 1, 21, 23, 10).getTime()),
    //         y: 19034.5
    //     },
    //     {
    //         x: (new Date(2020, 0, 1, 21, 33, 10).getTime()),
    //         y: 16769.4
    //     },
    //     {
    //         x: (new Date(2020, 0, 1, 21, 43, 10).getTime()),
    //         y: 13769.4
    //     }
    // ];
    // // for debug only
    // DrawGraf(_dataPoints);
    //#endregion

}

function GetUrlForPrices() {
    var _coinsArr = [];
    for (var key in reportsStorage) {
        var _coin = reportsStorage[key];
        _coinsArr.push(_coin.symbol);
    }

    if (_coinsArr.length == 0) {
        console.warn('GetUrlForPrices: Reports not found!');
        return null;
    }

    // var _postFix = "?fsyms=ETH,BTC&tsyms=USD";
    var _postFix = "?fsyms=" + _coinsArr.toString() + "&tsyms=USD";
    var _url = reportsLink + _postFix;
    return _url;
}

function GetDataPoints(dicCoins) {
    var _result = [];
    var _currTime = new Date().getTime();

    for (var point in dicCoins) {
        var _point = {
            x: _currTime,
            y: dicCoins[point]['USD']
        };
        var _coin = {
            type: "spline",
            name: point,
            xValueType: "dateTime",
            showInLegend: true,
            dataPoints: [_point]
        };
        _result.push(_coin);
    }
    return _result;
}

function UpdateChartCoins() {
    var _urlPrices = GetUrlForPrices();
    if (!_urlPrices) return;

    chartCoinsInterval = setInterval(function() {
        // 2. get data from server api
        $.get(_urlPrices, function(response) {
            //console.log('UpdateChartCoins: response = ', response);
            if (response.Message) {
                console.warn('UpdateChartCoins: ', response.Message);
                return;
            }
            //{"1WO":{"USD":0.08108},"1SG":{"USD":0.1638}}
            var _currTime = new Date().getTime();
            var _dicPrices = {}

            for (var point in response) {
                var _point = {
                    x: _currTime,
                    y: response[point]['USD']
                };
                _dicPrices[point] = _point;
            }

            // update chart
            // chartCoins.options.data[0].dataPoints.push(newres);
            for (var i = 0; i < chartCoins.options.data.length; i++) {
                var _dataCoin = chartCoins.options.data[i];
                if (_dicPrices[_dataCoin.name]) {
                    _dataCoin.dataPoints.push(_dicPrices[_dataCoin.name]);
                }
            }
            chartCoins.render();
        });
    }, 2000); // 2 sec
}

function DrawGraf(chartData) {
    //console.log('DrawGraf: chartData = ', chartData);

    // reset container
    $('.container').html('');

    var chartContainer = $('<div/>').attr('id', 'chartContainer').addClass('chartContainer');
    //console.log('DrawGraf: ')
    $('.container').append(chartContainer);

    var chartOptions = GetChartOptions(chartData);
    // chartCoins = $(chartContainer).CanvasJSChart(chartOptions);
    chartCoins = new CanvasJS.Chart("pageContainer", chartOptions);
    //console.log('DrawGraf: chartCoins = ', chartCoins);
    chartCoins.render();
    UpdateChartCoins();
}


$('#search').click(function() {
    ClearState();
    var _coinID = $('#inputSearch').val();
    Search(_coinID);
});


function Search(coinID) {
    console.log('Search: coinID = ', coinID);
    console.log('Search: reportsStorage = ', reportsStorage);
    // clear container
    $('#pageContainer').html('');

    var _coin = null;
    // for (var coinName in reportsStorage) {
    //     var _item = reportsStorage[coinName];
    //     console.log('Search: _item = ', _item);
    //     if (_item.symbol == coinID) {
    //         _coin = _item;
    //         break;
    //     }
    // }

    for (var coinName in _collectionCoins) {
        var _item = _collectionCoins[coinName];
        console.log('Search: _item = ', _item);
        if (_item.id == coinID) {
            _coin = _item;
            break;
        }
    }

    if (_coin) {
        // var _temp = $(_cardTemplate).clone();
        // var _template = $.tmpl(_temp, _coin);
        var _template = GetCard(_coin);
        _template.appendTo('#pageContainer');
    } else {
        var _message = "Coin by '" + coinID + "' not found";
        $('#pageContainer').html(
            '<div class="warn">' + _message + '</div');
    }
}

//============= Start Application ============
GetTemplates();
GetAllCoins();
// GetInfo('bitcoin', function(res) {
//     console.log('GetInfo.handler: res = ', res);
// });

function debug() {
    var newres = {
        x: (new Date(2020, 0, 1, 21, 53, 10).getTime()),
        y: 14500
    }
    chartCoins.options.data[0].dataPoints.push(newres);
    chartCoins.render();
}