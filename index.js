const express = require('express')

const bodyparser = require('body-parser')

const whoisinfo = require('whois-json')

const moment = require('moment')

const isValidDomain = require('is-valid-domain')

const psl = require('psl')

const app = express()

app.set('view engine','ejs')

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

const PORT = process.env.PORT || 4000

app.get('/',(req,res) => {
    res.render('bulkdomainagechecker',{title:"Bulk Domain Age Checker"})
})

app.post('/getbaseurl',(req,res) =>{

var parsed = psl.parse(req.body.domain);

console.log(parsed.domain)

res.json({

baseurl:parsed.domain

})


})


app.post('/singledomainagechecker',async(req,res) => {
  var url = req.body.domain;


  if (!isValidDomain(url)) {
    res.json({
      domain:url,
      domainage:"Invalid Domain"
    })
  } else {
    var results = await whoisinfo(url);

    var date = moment(results.creationDate).format("YYYY-MM-DD");
    var currentDate = moment(new Date()).format("YYYY-MM-DD");

    console.log(date);
    console.log(currentDate);

    var a = moment(date);
    var b = moment(currentDate);

    var years = b.diff(a, "year");
    a.add(years, "years");

    var months = b.diff(a, "months");
    a.add(months, "months");

    var days = b.diff(a, "days");

    var domainAge = years + " years " + months + " months " + days + " days";

    res.json({
      domain:url,
      domainage:domainAge
    })
  }
})


app.listen(PORT)