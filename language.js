var fs = require("fs");
var request = require("request");
var cheerio = require('cheerio');
url = "https://en.wikipedia.org/wiki/List_of_countries_by_spoken_languages"
file_download = "language.html";

function Languagefamily(name){
  this.name = name;
  this.branch = [];
  this.country = [];
}

function Branch(name){
  this.name = name;
  this.language = [];
  this.country = [];
}

function Language(name){
  this.name = name;
  this.country = [];
}

function Country(name, status){
  this.name = name;
  this.status = status;
}

var languages = [];
var family_counter = -1;
var branch_counter = -1;
var language_counter = -1

request.get(url, function(err, resp, html){
  if(err)throw err;
  $ = cheerio.load(html);
  var counter = 0;
  function nextElement(element) {
    if(element.is("h2")){
     if($(element).children(".mw-headline").children("a").text()){
       var newfamily = new Languagefamily($(element).children(".mw-headline").children("a").text());
       languages.push(newfamily);
       family_counter ++;
       branch_counter = -1;
     }
    }
    else if(element.is("h3")){
      if($(element).children(".mw-headline").children("a").text()){
        var newbranch = new Branch($(element).children(".mw-headline").children("a").text());
        languages[family_counter]["branch"].push(newbranch);
        branch_counter ++;
        language_counter = -1;
      }else if($(element).children(".mw-headline").text()){
        var newbranch = new Branch($(element).children(".mw-headline").text());
        languages[family_counter]["branch"].push(newbranch);
        branch_counter ++;
        language_counter = -1;
      }
    }else if(element.is("h4")){
      if($(element).children(".mw-headline").children("a").text()){
        var newlanguage = new Language($(element).children(".mw-headline").children("a").text());
        languages[family_counter]["branch"][branch_counter]["language"].push(newlanguage);
        language_counter ++;
      }
    }else if(element.is("table")){
      function nextTableElement(element){
        if($(element).children("td").children(".flagicon").next().text()){
          if(element.parent().prev().is("h2")){
            var newcountry = new Country($(element).children("td").children(".flagicon").next().text(), $(element).children("td").children(".flagicon").parent().next().text());
            languages[family_counter]["country"].push(newcountry);
          }else if(element.parent().prev().is("h3")){
            var newcountry = new Country($(element).children("td").children(".flagicon").next().text(), $(element).children("td").children(".flagicon").parent().next().text());
            languages[family_counter]["branch"][branch_counter]["country"].push(newcountry);
          }else if(element.parent().prev().is("h4")){
            var newcountry = new Country($(element).children("td").children(".flagicon").next().text(), $(element).children("td").children(".flagicon").parent().next().text());
            languages[family_counter]["branch"][branch_counter]["language"][language_counter]["country"].push(newcountry);
          }
        }else if(element.html() == null){
          return;
        }
        nextTableElement(element.next())
      }
      nextTableElement(element.children("tr").eq(1));
    }else if(element.html() == null){
      return;
    }
    nextElement(element.next())
  }
  nextElement($("h2").eq(1));
  // for(var i =0;i<languages.length;i++){
  //   for(key in languages[i]){
  //     var value = languages[i][key];
  //     for(var j=0;j<languages[i][key].length;j++){
  //       for(key1 in languages[i][key][j]){
  //         var value1 = languages[i][key][j][key1];
  //           for(var k=0;k<languages[i][key][j][key1].length;k++){
  //             console.log(languages[i][key][j][key1][k]);
  //           }
  //       }
  //     }
  //   }
  // }
  console.log(JSON.stringify(languages, null, '  '));
});
