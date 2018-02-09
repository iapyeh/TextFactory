//debug
//var s= new Date().getTime();Logger.log(s+' started');

function my_parseInt(s){
  // correct convert 08,09 to 8 and 9
  //bug of google: https://issuetracker.google.com/issues/36759856
   return typeof(s)=='string' ? (s.indexOf('.')>0 ? parseFloat(s) : parseInt(s.replace(/^0+/,''))) : s
}

/* en, zh_TW, ja_JP,ko_KR, */
var userlocale=Session.getActiveUserLocale();
if (userlocale.indexOf('en_')==0) userlocale = 'en';

var _userProperties;//singleton 
function getUserProperty(){
  if (_userProperties) return _userProperties;
  _userProperties = PropertiesService.getUserProperties();
  return _userProperties;
}
//debug - reset properties
function sanitizeProperties(){
  getUserProperty().deleteAllProperties();
}
//var objs = userProperties.getProperties()
//for (var key in objs){Logger.log('PROP:'+key+'='+objs[key])};

function onInstall(e){
  onOpen(e);
  /* moved to menuitem
  try{
    setupTZ()
  }
  catch(e){
  }
  */
}
function onOpen(e) {
  var menu = DocumentApp.getUi().createAddonMenu();
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
     // installed but not enabled
     menu.addItem('Yesterday\'s date', 'insertYesterday')
         .addItem('Today\'s date', 'insertNow')
         .addItem('Tomorrow\'s date', 'insertTomorrow')
         .addSeparator()
         .addItem('Calendar', 'showCalendar')
         .addSeparator()
         .addItem('Set Time Zone', 'setupTZ')
         .addItem('View more options', 'showSidebar')
         
  } else {
    // installed and enabled
     try{
       menu.addItem(i18n('Yesterday\'s date'), 'insertYesterday')
         .addItem(i18n('Today\'s date'), 'insertNow')
         .addItem(i18n('Tomorrow\'s date'), 'insertTomorrow')
         .addSeparator()
         .addItem(i18n('Calendar'), 'showCalendar')
         .addSeparator()
         .addItem('Set Time Zone', 'setupTZ')
         .addItem(i18n('View more options'), 'showSidebar')
     }
     catch(e){
       menu.addItem('Yesterday\'s date', 'insertYesterday')
         .addItem('Today\'s date', 'insertNow')
         .addItem('Tomorrow\'s date', 'insertTomorrow')
         .addSeparator()
         .addItem('Calendar', 'showCalendar')
         .addSeparator()
         .addItem('Set Time Zone', 'setupTZ')
         .addItem('View more options', 'showSidebar')
     }
  }
  menu.addToUi();
}

function showSidebar() {
  DocumentApp.getUi().showSidebar(
      HtmlService
          .createHtmlOutputFromFile('sidebar.html')
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle(i18n('Text Factory'))
          .setWidth(150)); /* pixels */
}
function showCalendar(){
  DocumentApp.getUi().showModelessDialog(
      HtmlService
          .createHtmlOutputFromFile('calendar.html')
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle(i18n('Calendar'))
          .setHeight(315)
          .setWidth(270),
      'Calendar')
}

/*
function getTextsFile(){
  // check if the texts file exists, if not copy it.
  var name = 'TextFactory-TextsOptions'
  var iter = DriveApp.getFilesByName(name)
  if (iter.hasNext()) return iter.next()
  var sampleFileId = '1Iowlz7OOr_r1VABWphroQG8mv42FmEi4LzpQJ_-VPo8'
  var sampleFile = DriveApp.getFileById(sampleFileId)
  var myfile = sampleFile.makeCopy(name,DriveApp.getRootFolder())
  return myfile;
}
*/

function setupTZ() {
  var htmlOutput = HtmlService
     .createHtmlOutputFromFile('splash.html')
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(100);
 DocumentApp.getUi().showModelessDialog(htmlOutput, 'set Time Zone to');
}
/* workaround for async issue */


function getDefaultFormats(){
  //keep it five
  return  ['%Y/%m/%d %H:%M','%Y/%m/%d (%A)','%Y/%m/%d %H:%M:%S','%Y/%m/%d %p%h:%M','%b %d, %Y'];
}
function getProperties() {
  //var userProperties = PropertiesService.getUserProperties();
  var formats; 
  var fmts = getUserProperty().getProperty('formats');
  if (fmts) formats = fmts.split('\t')
  else formats = getDefaultFormats();

  return {formats:formats}
}
function setProperty(key,value){
  getUserProperty().setProperty(key, value);
}
function deleteProperty(key){
  PropertiesService.getUserProperties().deleteProperty(key)
}
/* utilities */
// create locale for strftime
var locale={'en':{
  days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  daysshort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  months:["January","February","March","April","May","June","July","August","September","October","November","December"],
  monthsshort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  }
}
function initializeUserLocale(){
  var uprop = getUserProperty();
  if (userlocale != 'en'){  
    var currentLocale = uprop.getProperty('userlocale');
    if (currentLocale==userlocale){
      //do nothing
      //Logger.log('resue locale: '+userlocale)
    }
    else{
      //locale changed, clear current cached properties
      //Logger.log('reset locale cache to '+userlocale+' from '+currentLocale+' @'+new Date())
      var objs = uprop.getProperties();
      var prefix = '*'+userlocale;
      var keeps = {'userlocale':userlocale};
      for (var key in objs){
        if (key.substr(0,1)!='*' || key.indexOf(prefix)==0){
          keeps[key] = objs[key];
        }
        //else Logger.log('remove property:'+key);
      }
      //userProperties.deleteAllProperties();
      uprop.setProperties(keeps,true);
    }
    var days=[],daysshort=[],months=[],monthsshort=[],x;
    for (var i=0;i<7;i++){
      x = i18n(locale.en.days[i])
      if (x===null){
        for (var k=i;k<7;k++){
          days.push(locale.en.days[k]);
          daysshort.push(locale.en.days[k]);          
        }
        break;
      }      
      days.push(x);
      daysshort.push(x);
    };
    for (var i=0;i<12;i++){
      x = i18n(locale.en.months[i]);
      if (x===null){
        for (var k=i;k<12;k++){
          days.push(locale.en.months[k]);
          daysshort.push(locale.en.months[k]);          
        }
        break;
      }      
      months.push(x);
      monthsshort.push(x);
    }
    locale[userlocale] = {days:days,months:months,daysshort:daysshort,monthsshort:monthsshort};
  }
}
/* i18n utilities */
var _i18nc=0;
function _i18n(x,nosave){
    var t = getUserProperty().getProperty('*'+userlocale+x)
    if (t){
      //Logger.log('hit '+t+';'+nosave);
      return nosave ? [t,true] : t;
    }
    _i18nc += 1;
    try{
      if ((_i18nc+1)%20==0) Utilities.sleep(1000);
      //Logger.log('miss '+x+';'+nosave+';'+_i18nc);
      t = LanguageApp.translate(x,'en',userlocale);
    }
    catch(e){
       //Logger.log('i18n:'+e);
       return null;
    }
    if (!nosave) getUserProperty().setProperty('*'+userlocale+x,t);
    return nosave ? [t,false] : t;
}
function i18n(x,nosave){
  var maxLengthInCache = 200;
  if (userlocale==='en') return nosave ? [[x,[x,true]]] : x ;
  else {
      // max length in cache is 255, keep the size less than 200
      if (x.length < maxLengthInCache) return nosave ? [[x,_i18n(x,true)]] : _i18n(x) ;
      var xs = [],ret;
      for (var i=0,l=x.length;i<l;i+=maxLengthInCache){
        var t = x.substr(i,maxLengthInCache)
        ret = _i18n(t,nosave)
        if (ret===null) return null;
        else if (nosave) xs.push([t,ret]) 
        else xs.push(ret);
      }
      return nosave ? xs : xs.join('');
  };
}
function translate(texts,src){
  //if (userlocale==='en') return texts;
  var rets= [],ret;
  var newtranlations = {};
  var cache = {};
  var hasNewtranlations = false;
  for (var i=0,l=texts.length;i<l;i++){
      ret = cache[texts[i]];
      if (ret) {rets.push(ret);continue}
      ret = i18n(texts[i],true);
      if (ret===null){
        // too many calls to LanguageApp.translate
        for (var k=i;k<l;k++){
          rets.push(texts[k]);
        }
        break;
      }
      // collect translated
      var t = [];
      for (var j=0;j<ret.length;j++){
        if (ret[j][1]===null){
          //fail to translate
          t.push(ret[j][0]);
          continue;
        }
        // fail to hit, save it
        if (ret[j][1][1]===false) {newtranlations['*'+userlocale+ret[j][0]] =ret[j][1][0]; hasNewtranlations=true};
        t.push(ret[j][1][0]);
      }
      ret = t.join('');
      rets.push(ret);
      cache[texts[i]] = ret;
  }
  // update db
  if (hasNewtranlations){
    getUserProperty().setProperties(newtranlations, false)
  }
  
  return rets
}
/* end of i18n utility */

/* manipulation the doc starts*/
function getSelection(warnning){
  if (typeof(warnning)==='undefined') warnning = true;
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    return selection;
  }
  else{
    if (warnning) DocumentApp.getUi().alert(i18n('Please select text to format.'));
    return;
  }
}
function replaceSelection(txt,fill){
    var selection =  getSelection(false);
    if (!selection) return false;
  //replace the selection
  var selectedElements = selection.getSelectedElements();
  var doc = DocumentApp.getActiveDocument();
  var rangeBuilder = doc.newRange();
  var makeTexts = function(c,len){
    var cs= [];
    for (var i=0;i<len;i++){cs.push(c)};
    return cs.join('')
  }
  for (var i = 0; i < selectedElements.length; ++i) {
    var selectedElement = selectedElements[i];      
    // Only modify elements that can be edited as text; skip images and other
    // non-text elements.
    var ele = selectedElement.getElement();
    var text = ele.editAsText();          
    if (selectedElement.isPartial()) {
      var t = text.getText();
      var txt2add;
      if (i==selectedElements.length-1){
        txt2add = fill ? makeTexts(txt,selectedElement.getEndOffsetInclusive()-selectedElement.getStartOffset()+1) : txt;
      }
      else{
        txt2add = '';
      }
      var newt = t.substr(0,selectedElement.getStartOffset())+txt2add+t.substr(selectedElement.getEndOffsetInclusive()+1);
      text.setText(newt);
      if (txt2add.length){
        var pos = selectedElement.getStartOffset()+txt2add.length;
        doc.setCursor(doc.newPosition(ele,pos));
        rangeBuilder.addElement(text, selectedElement.getStartOffset(), pos-1)
      }
    } else {
      var t = ele.getType();
      if (t == DocumentApp.ElementType.TABLE_CELL || i==selectedElements.length-1){
        var txt2add =  fill ? makeTexts(txt,text.getText().length) : txt;
        text.setText(txt2add);
        rangeBuilder.addElement(ele)
        if (i==selectedElements.length-1) doc.setCursor(doc.newPosition(ele,txt.length-1));
      }
      else{
        if (t == DocumentApp.ElementType.TEXT || t == DocumentApp.ElementType.PARAGRAPH) text.removeFromParent();
        else rangeBuilder.addElement(ele)
      }
    }
  }        
  doc.setSelection(rangeBuilder.build());
  return true;
}
function insertAtCursor(txt){
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  if (cursor) {
    // Attempt to insert text at the cursor position. If insertion returns null,
    // then the cursor's containing element doesn't allow text insertions.
    var element = cursor.insertText(txt);
    var rangeBuilder = doc.newRange();
    rangeBuilder.addElement(element);
    if (element) {
        try{
          doc.setCursor(doc.newPosition(element.getNextSibling(),0));
        }
        catch(e){
          doc.setCursor(doc.newPosition(element,txt.length));
        }
        doc.setSelection(rangeBuilder.build());
    } else {
      DocumentApp.getUi().alert(i18n('Cannot insert text at this cursor location.'));
      return;
    }
  } else {
    var selection =  getSelection(false);
    if (selection){
        //replace the selection
        var selectedElements = selection.getSelectedElements();
        var rangeBuilder = doc.newRange();
        for (var i = 0; i < selectedElements.length; ++i) {
          var selectedElement = selectedElements[i];      
          // Only modify elements that can be edited as text; skip images and other
          // non-text elements.
          var ele = selectedElement.getElement();
          var text = ele.editAsText();          
          if (selectedElement.isPartial()) {
            var t = text.getText();
            var txt2add;
            if (i==selectedElements.length-1){
              txt2add = txt;
            }
            else{
              txt2add = '';
            }
            var newt = t.substr(0,selectedElement.getStartOffset())+txt2add+t.substr(selectedElement.getEndOffsetInclusive()+1);
            text.setText(newt);
            if (txt2add.length){
              var pos = selectedElement.getStartOffset()+txt2add.length;
              doc.setCursor(doc.newPosition(ele,pos));
              rangeBuilder.addElement(text, selectedElement.getStartOffset(), pos-1)
            }
          } else {
            var t = ele.getType();
            if (t == DocumentApp.ElementType.TABLE_CELL || i==selectedElements.length-1){
              text.setText(txt);
              rangeBuilder.addElement(ele)
              if (i==selectedElements.length-1) doc.setCursor(doc.newPosition(ele,txt.length-1));
            }
            else{
              if (t == DocumentApp.ElementType.TEXT || t == DocumentApp.ElementType.PARAGRAPH) text.removeFromParent();
              else rangeBuilder.addElement(ele)
            }            
          }
        }        
        doc.setSelection(rangeBuilder.build());
        return;
    }
    DocumentApp.getUi().alert(i18n('Cannot find a cursor in the document.'));
  }
}
function selectionReplaceWith(char){
  replaceSelection(char,true)
}
function selectionEncloseWith(prefix,surfix){
  var selection = getSelection(false);
  if (!selection) {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    if (cursor) {
      cursor.insertText(prefix+surfix);
    }
    return;
  }
  var selectedElements = selection.getSelectedElements();
  var rangeBuilder = DocumentApp.getActiveDocument().newRange();
  for (var i = 0; i < selectedElements.length; ++i) {
    var selectedElement = selectedElements[i];

    // Only modify elements that can be edited as text; skip images and other
    // non-text elements.
    var text = selectedElement.getElement().editAsText();
    if (selectedElement.isPartial()) {
      var ss=-1, se = -1;
      if (prefix.length>0){
        text.insertText(selectedElement.getStartOffset(),prefix);
        ss = selectedElement.getStartOffset();
        se = ss + prefix.length;
      }
      if (surfix.length>0){
        ss = (ss==-1) ? selectedElement.getEndOffsetInclusive()+2 : ss;
        se = (se==-1) ? (ss+surfix.length) : (selectedElement.getEndOffsetInclusive()+2)+surfix.length
        text.insertText(selectedElement.getEndOffsetInclusive()+2,surfix);
      }
      rangeBuilder.addElement(text,ss,se-1);
    } else {
      if (prefix.length>0) text.insertText(0,prefix);
      if (surfix.length>0) text.appendText(surfix);
      rangeBuilder.addElement(selectedElement.getElement());
    }
  }
  DocumentApp.getActiveDocument().setSelection(rangeBuilder.build());
}
function applyToSelected(callback,selectionWarning,params){
  var selection = getSelection(selectionWarning);
  if (!selection) return;
  var selectedElements = selection.getSelectedElements();
  var rangeBuilder = DocumentApp.getActiveDocument().newRange();
  for (var i = 0; i < selectedElements.length; ++i) {
    var selectedElement = selectedElements[i];
    // Only modify elements that can be edited as text; skip images and other
    // non-text elements.
    var text = selectedElement.getElement().editAsText();
    var t = text.getText();
    if (t.length==0) continue;
    var oritext = text.copy();
    var style;
    if (selectedElement.isPartial()) {
      var t = t.substring(selectedElement.getStartOffset(),selectedElement.getEndOffsetInclusive()+1);
      var args = [t].concat(params)
      var replacedt = callback.apply(this,args);
      style = oritext.getAttributes(selectedElement.getStartOffset());
      text.deleteText(selectedElement.getStartOffset(), selectedElement.getEndOffsetInclusive());
      text.insertText(selectedElement.getStartOffset(),replacedt);
      var ss = selectedElement.getStartOffset();
      rangeBuilder.addElement(text,ss,ss+replacedt.length-1);
    } else {
      style = oritext.getAttributes();
      var args = [t].concat(params)
      text.setText(callback.apply(this,args));
      rangeBuilder.addElement(selectedElement.getElement())
    }
    restoreTextStyle(text,style);  
  }
  DocumentApp.getActiveDocument().setSelection(rangeBuilder.build());
}

/* work-around to preserve the text-style */
function restoreTextStyle(text, style){
    var newstyle= {}
    for (var s in style){
       if (style[s]) {
         newstyle[s] = style[s];
       }
    }
    text.setAttributes(newstyle);
}

/* Date Time */
function getNewDate(){
  var tzoffset = getUserProperty().getProperty('tzoffset');
  tzoffset = tzoffset ? my_parseInt(tzoffset) : 0;
  var d = new Date()
  var offset = tzoffset - d.getTimezoneOffset();
  if (offset) d.setMinutes(d.getMinutes()-offset)
  return d;
}
function insertFromMenu(d){
  try{
    var fmts = getUserProperty().getProperty('formats');
    if (fmts) menuformats = fmts.split('\t')
    else menuformats =  getDefaultFormats();
    var fmt = menuformats.length ? menuformats[0] : '%Y/%m/%d %H:%M';
    insertAtCursor(strftime(fmt,d,userlocale));
  }
  catch(e){
    Logger.log(e);
  }
}
function insertNow(){
  var d = getNewDate();
  insertFromMenu(d)
}
function insertYesterday(){
  var d = getNewDate();
  d.setDate(d.getDate() - 1);
  insertFromMenu(d)
}
function insertTomorrow(){
  var d = getNewDate();
  d.setDate(d.getDate() + 1);
  insertFromMenu(d)
}
function insertDate(y,m,d){
  var now = new Date()
  var d = new Date(y,m,d,now.getHours(),now.getMinutes(),now.getSeconds())
  insertFromMenu(d)
}
/* numbers */

function thousandCommasSelected(sp){
  applyToSelected(thousandCommas,true,[sp]);
}
function zerofill(n,size){
  n = '' + n;
  size = size || 3;
  while (n.length < size) {
    n = '0' + n;
  }
  return n;
}
function zeropading(x, size) {
    return x.toString().replace(/(\D?)(\d+)/g,function(m,p1,p2,offset,s){return p1+zerofill(p2,size)});
}
function zeropadSelected(size) {
  applyToSelected(zeropading,true,[size]);
}
/* phone numbers */
/*
function dashSeperate(x,size) {
  var r = new RegExp('\\B(?=(\\d{'+size+'})+(?!\\d))','g');
  return x.toString().replace(/(\d+)/g,function(m,p1,offset,s){
    // if there is only one digit in the 1st section, add it to next section
    // disallow 0-921-913-124, instead 0921-913-124
    var t = p1.replace(r, "-");
    if (size==3 && p1.length%size==1) t = t.replace(/\-/,'');
    return t;
  });
}
function dashSeperateSelected(size){
  if (typeof(size)==='undefined') size = 3;
  applyToSelected(dashSeperate,true,[size]);
}
*/
/* text convertion */
function fullhalfConvert(t,toHalf,typeflag){
   //[half-start,half-end, full-start respects to half-start]
   var sets =[
// #SYMBOL
    [1, 65377, 65377, 12290],
    [1, 65378, 65379, 12300],
    [1, 65380, 65380, 12289],
    [1, 65381, 65381, 12539],
// #ALPHABET
    [2, 65382, 65382, 12530],
    [2, 65383, 65383, 12449],
    [2, 65384, 65384, 12451],
    [2, 65385, 65385, 12453],
    [2, 65386, 65386, 12455],
    [2, 65387, 65387, 12457],
    [2, 65388, 65388, 12515],
    [2, 65389, 65389, 12517],
    [2, 65390, 65390, 12519],
    [2, 65391, 65391, 12483],
    [2, 65392, 65392, 12540],
    [2, 65393, 65393, 12450],
    [2, 65394, 65394, 12452],
    [2, 65395, 65395, 12454],
    [2, 65396, 65396, 12456],
    [2, 65397, 65398, 12458],
    [2, 65399, 65399, 12461],
    [2, 65400, 65400, 12463],
    [2, 65401, 65401, 12465],
    [2, 65402, 65402, 12467],
    [2, 65403, 65403, 12469],
    [2, 65404, 65404, 12471],
    [2, 65405, 65405, 12473],
    [2, 65406, 65406, 12475],
    [2, 65407, 65407, 12477],
    [2, 65408, 65408, 12479],
    [2, 65409, 65409, 12481],
    [2, 65410, 65410, 12484],
    [2, 65411, 65411, 12486],
    [2, 65412, 65412, 12488],
    [2, 65413, 65418, 12490],
    [2, 65419, 65419, 12498],
    [2, 65420, 65420, 12501],
    [2, 65421, 65421, 12504],
    [2, 65422, 65422, 12507],
    [2, 65423, 65427, 12510],
    [2, 65428, 65428, 12516],
    [2, 65429, 65429, 12518],
    [2, 65430, 65435, 12520],
    [2, 65436, 65436, 12527],
    [2, 65437, 65437, 12531],
// #SYMBOL
    [1, 65438, 65439, 12443],
// #SYMBOL
    [1, 65440, 65440, 12644],
// #ALPHABET
    [2, 65441, 65470, 12593],
    [2, 65474, 65479, 12623],
    [2, 65482, 65487, 12629],
    [2, 65490, 65495, 12635],
    [2, 65498, 65500, 12641],
// #SYMBOL
    [1, 10629, 10630, 65375],
    [1, 162, 163, 65504],
    [1, 172, 172, 65506],
    [1, 175, 175, 65507],
    [1, 166, 166, 65508],
    [1, 165, 165, 65509],
    [1, 8361, 8361, 65510],
    [1, 65512, 65512, 9474],
    [1, 65513, 65516, 8592],
    [1, 65517, 65517, 9632],
    [1, 65518, 65518, 9675],
// #SYMBOL
    [1, 32, 32, 12288],
    [1, 33, 47, 65281],
// #DIGIT
    [4, 48, 57, 65296],
// #SYMBOL
    [1, 58, 64, 65306],
// #ALPHABET
    [2, 65, 90, 65313],
// #SYMBOL
    [1, 91, 96, 65339],
// #ALPHABET
    [2, 97, 122, 65345],
// #SYMBOL
    [1, 123, 126, 65371]
];
   if (toHalf){
      //reverse the set
      var setsR = [],il=sets.length;
      for (var i=0;i<il;i++){
         if ((sets[i][0]&typeflag) == sets[i][0]) {
           setsR.push([sets[i][0],sets[i][3],sets[i][3]+(sets[i][2]-sets[i][1]),sets[i][1]]);
         }
      }
      sets = setsR;
   }
   var replaced = [];
   var c=0;
   var pieces = [];
   var lastPos = 0;
   var jl = sets.length,il=t.length;
   for (var i=0;i<il;i++){
      c = t.charCodeAt(i);
      for (var j=0;j<jl;j++){
        var set = sets[j];
        if ((set[0]&typeflag) != set[0]) continue;
        if (c >= set[1] && c <= set[2]) {
          if (i-lastPos>0) pieces.push(t.substring(lastPos,i));
          pieces.push(String.fromCharCode(set[3]+(c-set[1])));
          lastPos = i+1;
          break;
        }
      }
   }
   if (lastPos >0 ) {pieces.push(t.substring(lastPos));return pieces.join('');}
   else {return t};
}
function fullhalfConvertSelected(toHalf,flag){
   applyToSelected(fullhalfConvert,true,[toHalf,flag]);
}
function puncFullhalfConvert(t,toHalf,flag){
  //[half-start,half-end, full-start respects to half-start]
  var cSpace = ((flag & 1) == 1);
  var src,dst;
  if (toHalf){
    src=['\\‘','\\’','\\“','\\”','\\｛','\\｝','\\（','\\）','\\『','\\』','\\［','\\］','\\、','\\，','\\…','\\‥','\\。','\\｡','\\《','\\》','\\〈','\\〉','\\〜','\\：','\\！','\\？','\\—','\\－','\\—','\\；'];
    dst=['\'','\'','"','"','{','}','(',')','[[',']]','[',']','､',',','...','..','.','.','<<','>>','<','>','~',':','!','?','-','-','-',';'];
    if (cSpace) {src.push('\\　');dst.push(' ');}
  }
  else{
    src=['\\\'','\\"','\\{','\\}','\\(','\\)','\\[\\[','\\]\\]','\\[','\\]','\\､','\\,','\\.\\.\\.','\\.\\.','\\.','\\<\\<','\\>\\>','\\<','\\>','\\~','\\:','\\!','\\?','\\-','\\;'];
    dst=['’','”','｛','｝','（','）','『','』','［','］','、','，','…','‥','。','《','》','〈','〉','〜','：','！','？','—','；'];
    if (cSpace) {src.push('\\ ');dst.push('　');}
  }
  var il = src.length;
  var pat;
  for (var i=0;i<il;i++){
    pat = new RegExp(src[i],'g');
    t = t.replace(pat,dst[i]);
  }
  return t;
}
function puncFullhalfConvertSelected(toHalf,flag){
   //default to full-width exclude space
   if (typeof(toHalf)==='undefined'){toHalf=false;flag=0};
   applyToSelected(puncFullhalfConvert,true,[toHalf,flag]);
}
function caseConvert(t,flag){
   switch(flag){
     case 1:
       return t.toLowerCase();
       break
     case 2:
       return t.toUpperCase();
       break
     case 3:
       return t.replace(/([a-zA-Z]+)/g,function(m,p1,s){return p1.charAt(0).toUpperCase()+p1.slice(1).toLowerCase()})
       break
   }
}
function caseConvertSelected(flag){
   if (typeof(flag)=='undefined') flag=3;
   applyToSelected(caseConvert,true,[flag]);
}
/* text options
function test_getTextsOptions(){
  Logger.log(getTextsOptions())
}
 */

/* dynamic values */
function setTimezoneOffset(tzoffset){
  setProperty('tzoffset',tzoffset)
}
function getTimezoneOffset(){
  return getUserProperty().getProperty('tzoffset');
}
function getServerValues(){
  try{
    //save tzoffset to user properge
    //setProperty('tzoffset',tzoffset)
    var tzoffset = getTimezoneOffset()
    if (typeof(tzoffset)=='undefined') tzoffset = null
    
    var user = Session.getActiveUser();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'];
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    var properties = getProperties();
    
    /*
    * temporaryly disabled for not been tested feature 

    var rets = {locale:userlocale,properties:properties,textOptions:getTextsOptions()};
    
    */
    var rets = {locale:userlocale,properties:properties,textOptions:false,tzoffset:tzoffset};
    
    if (userlocale=='en'){
      //pass
    }
    else{
      //if (!locale[userlocale])      
      initializeUserLocale();
      rets.localedata = locale[userlocale];
    }
    return rets;
  }
  catch(e){
    var rets = {locale:userlocale,properties:{formats:[]},textOptions:false,err:''+e};
  }
   
}
/*
 * Hebrew Calendar
 */
var hebrew_date_cache={};
function getHebrew(d,key,callback){
  //https://www.hebcal.com/home/219/hebrew-date-converter-rest-api
  //var d = new Date()
  var url = 'http://www.hebcal.com/converter/?cfg=json&gy='+d.getFullYear()+'&gm='+(1+d.getMonth())+'&gd='+d.getDate()+'&g2h=1'
  try{
    var hd = UrlFetchApp.fetch(url).getContentText()
    var obj = JSON.parse(hd)
    hebrew_date_cache[key] = obj
    callback(obj)
  }
  catch(e){
    Logger.log(e)
    callback(null)
  }
}
/*
 * Lunar Calendar
 */
function LunarCalendar(){
    this.lunarInfo=new Array(  
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,  
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,  
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,  
        0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,  
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,  
        0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,  
        0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,  
        0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,  
        0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,  
        0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,  
        0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,  
        0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,  
        0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,  
        0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,  
        0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,  
        0x14b63); 
        
    this.Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");  
    this.Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");  
    this.nStr1 = new Array('','一','二','三','四','五','六','七','八','九','十');  
    this.nStr2 = new Array('初','十','廿','卅','□');
}
LunarCalendar.prototype = {
    lYearDays : function(y) {  
        var i, sum = 348;  
        for(i=0x8000; i>0x8; i>>=1) sum += (this.lunarInfo[y-1900] & i)? 1: 0;  
        return(sum+this.leapDays(y));  
    },
    leapDays : function(y) {  
        if(this.leapMonth(y))  return((this.lunarInfo[y-1900] & 0x10000)? 30: 29);  
        else return(0);  
    },
    leapMonth : function(y) {  
        return(this.lunarInfo[y-1900] & 0xf);  
    },
    monthDays : function (y,m) {  
        return( (this.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );  
    },
    md2Str:function(n,month){
      var n1 = Math.floor(n/10)
      var n0 = n - (n1*10)
      if (month) return (n1==0 ? '' : this.nStr2[n1])+(n0==0 ? '' : this.nStr1[n0])
      else return (this.nStr2[n1])+(n0==0 ? '' : this.nStr1[n0])
    },
    toLunar: function (objDate) {  

        var lunarDate = {}
      
        var i, leap=0, temp=0;  
        var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;  
  
        for(i=1900; i<2050 && offset>0; i++) { temp=this.lYearDays(i); offset-=temp; }  
  
        if(offset<0) { offset+=temp; i--; }  
  
        lunarDate.year = i;  
  
        leap = this.leapMonth(i); //闰哪个月  
        lunarDate.isLeap = false;  
  
        for(i=1; i<13 && offset>0; i++) {  
            //闰月  
            if(leap>0 && i==(leap+1) && lunarDate.isLeap==false)  
                { --i; lunarDate.isLeap = true; temp = this.leapDays(lunarDate.year); }  
            else  
                { temp = this.monthDays(lunarDate.year, i); }  
  
            //解除闰月  
            if(lunarDate.isLeap==true && i==(leap+1)) lunarDate.isLeap = false;  
  
            offset -= temp;  
        }  
  
        if(offset==0 && leap>0 && i==leap+1)  
        if(lunarDate.isLeap)  
            { tlunarDatehis.isLeap = false; }  
        else  
            { lunarDate.isLeap = true; --i; }  
  
        if(offset<0){ offset += temp; --i; }  
  
        lunarDate.year = this.cyclical(lunarDate.year)
        lunarDate.month = this.md2Str(i,true)
        lunarDate.day = this.md2Str(offset + 1);
        return lunarDate
    },
    cyclical:function(year) {  
        var num = year - 1900 + 36
        return(this.Gan[num%10]+this.Zhi[num%12]);  
    }
}

var lunar_date_cache = {}
var lunar_calendar;
function getLunar(d,key){
  if (!lunar_calendar) lunar_calendar = new LunarCalendar()
  var lu = lunar_calendar.toLunar(d)
  lunar_date_cache[key] = lu
  return lu
}


/* source of strftime */
/*
function shortname(name) {
    return name.substr(0, 3);
}
*/
function thousandCommas(n,sp) {
  if (!sp) sp = ','
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sp);
}
function zeropad(n, size) {
    n = '' + n; /* Make sure it's a string */
    size = size || 2;
    while (n.length < size) {
        n = '0' + n;
    }
    return n;
}
function getWeek(d){
    var onejan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - onejan)/86400000 - (6-onejan.getDay())%6)/7);
}
function getWeekMonday(d){
    var onejan = new Date(d.getFullYear(), 0, 1);
    return 1+Math.floor(((d - onejan)/86400000 - ((onejan.getDay()+6)%7 + 1))/7);
}
function getDayOfYear(d){
    var j1= new Date(d);
    j1.setMonth(0, 0);
    return Math.round((d-j1)/8.64e7);
}
function twelve(n) {
    return (n <= 12) ? (n==0 ? 12 : n) : n - 12;
}
function tzOffset(offset){
  var s = ((offset<0? '+':'-')+ // Note the reversed sign!
          zeropad(my_parseInt(Math.abs(offset/60)), 2)+
          zeropad(Math.abs(offset%60), 2))
  return s
}

function strftime(format, date,loc) {
    date = date || getNewDate();
    var locfmtpat = /\%[abAB]/; 
    if (locfmtpat.test(format) && !locale[loc]){
      initializeUserLocale();
    }
    var l = locale[loc] || locale['en'];
    var months = l.months, days = l.days;
    var hd; //hebrew data
    var fields = {
        a: l.daysshort[date.getDay()],
        A: days[date.getDay()],
        b: l.monthsshort[date.getMonth()],
        B: months[date.getMonth()],
//        c: date.toLocaleString(),
        d: zeropad(date.getDate()),
        H: zeropad(date.getHours()),
        h: zeropad(twelve(date.getHours())),
        j: getDayOfYear(date),
        m: zeropad(date.getMonth() + 1),
        M: zeropad(date.getMinutes()),
        n: date.getMonth() + 1,
        N: date.getDate(),
        p: (date.getHours() >= 12) ? 'PM' : 'AM',
        S: zeropad(date.getSeconds()),
        w: zeropad(date.getDay() + 1),
        W: getWeekMonday(date)+1,
        U: getWeek(date)+1,
//        x: date.toLocaleDateString(),
//        X: date.toLocaleTimeString(),
        y: ('' + date.getFullYear()).substr(2, 4),
        Y: '' + date.getFullYear(),
        Z: tzOffset(date.getTimezoneOffset()),
        '%' : '%',
    };
    var result = '', i = 0, len=format.length;
    var hd = {hy:0,hm:'-',hd:'-',events:[],hebrew:'-'}
    var lu = {year:0,month:'',day:''}
    while (i < format.length) {
        if (format[i] === '%' && (i+3<len) && (format[i+1]=='H') && (format[i+2]=='e')) {
            if (hd.hy==0) {
              var key = date.getFullYear()+':'+date.getMonth()+':'+date.getDate()
              if (hebrew_date_cache[key]) hd = hebrew_date_cache[key]
              else {
                hd.hy = '2016'
                getHebrew(date,key,function(result){
                   hd = result
                })
              }
            }
            // %HeY, %HeM, %HeD
            switch (format[i + 3]){
              case 'Y':
                  result = result + hd.hy
                  break
              case 'M':
                  result = result + hd.hm
                  break
              case 'D':
                  result = result + hd.hd
                  break
              case 'H':
                  result = result + hd.hebrew
                  break
              case 'E':
                  result = result + (hd.events ? hd.events.join(', ') : '')
                  break
              default:
                  result = result + format[i]+format[i + 1]+format[i + 2]+format[i + 3]
            }            
            i += 3;
        }  
        else if (format[i] === '%' && (i+3<len) && (format[i+1]=='L') && (format[i+2]=='u')) {
            if (lu.year==0) {
              var key = date.getFullYear()+':'+date.getMonth()+':'+date.getDate()
              if (lunar_date_cache[key]) {
                lu = lunar_date_cache[key]
              }
              else {
                lu = getLunar(date,key)
              }
            }
            // %LuY, %LuM, %LuD
            switch (format[i + 3]){
              case 'Y':
                  result = result + lu.year
                  break
              case 'M':
                  result = result + lu.month
                  break
              case 'D':
                  result = result + lu.day
                  break
              default:
                  result = result + format[i]+format[i + 1]+format[i + 2]+format[i + 3]
            }            
            i += 3;
        }
        else if (format[i] === '%' && (i+3<len) && (format[i+1]=='e') && (format[i+2]=='n') && (format[i+3]=='b'||format[i+3]=='B')) {        
          // %enB, %enB
            result = result + (format[i+3]=='b' ? locale.en.monthsshort[date.getMonth()] : locale.en.months[date.getMonth()])
            i += 3;          
        }
        else if ((format[i] == '%') && (i+2<len) && (format[i+1]=='*')) {
            // %*d, %*H, %*S, 
            result = result + my_parseInt(fields[format[i + 2]]);
            i+=2;
        }
        else if ((format[i] == '%') && (i+2<len) && (format[i+1]=='+')) {
            // %+d
            var n = my_parseInt(fields[format[i + 2]])
            if (n>=11 && n<=13){
              n = n+'th'
            }
            else if (n%10==1) n = n+'st'
            else if (n%10==2) n = n+'nd'
            else if (n%10==3) n = n+'rd'
            else n = n+'th'
            result = result + n;
            i += 2;
        }        
        else if (format[i] === '%' && (i+1<len)) {
            // one char format, ex %Y, %M
            result = result + fields[format[i + 1]];
            ++i;
        }
        else {
            // regular char, not in format
            result = result + format[i];
        }
        ++i;
    }
    return result;
}
//debug
//var e= new Date().getTime();Logger.log((e-s)+' used');
