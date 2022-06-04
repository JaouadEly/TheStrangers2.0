const express = require('express');
const app = express();
const ejs= require('ejs'); 
import { Console } from 'console';
import fetch from 'cross-fetch';
import {Address} from './assets/AdresClasse';
import {Bedrijf} from './assets/BedrijfClasse';
import {BedrijfProps} from './assets/BedrijfClasse';

//connect to mongodb
//const dbURI = 'mongodb+srv://User1:Admin1@cluster0.vns4g.mongodb.net/test';
const{MongoClient} = require('mongodb');
const uri:string= "mongodb+srv://User1:Admin1@cluster0.vns4g.mongodb.net/NationaleBankBelgie?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useUnifiedTopology:true});
const DATABASE ="NationaleBankBelgie";
const COLLECTION = "Geschiedenis";

const doDBCalls = async() => {
  try {
      console.log("-------- Connecting to DB ------------");
      await client.connect();
      console.log('-----------Connected-------------------');

  }
  catch(exc){
      console.log("Connection Failed");
  }
}
doDBCalls();

app.set('view engine','ejs'); 
app.set('port', 3000);
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));


const DetailAPIInput = (async (number : string)  => {
  try {
    let res  = await  fetch('https://ws.uat2.cbso.nbb.be/authentic/deposit/'+ number +'/accountingData', {
      headers:{
          'Accept' : 'application/x.jsonxbrl',
          'NBB-CBSO-Subscription-Key' :'de631b01365f42c49905b547f272af74',
          'X-Request-Id':''
      }});
      if (res.status >= 400) {
        const BedrijfPropsOutput = new BedrijfProps("Onbestaande","Onbestaande","Onbestaande");
        return(BedrijfPropsOutput);
      } else {

    const BedrijfPropsOutput = new BedrijfProps("","","");

      let detailOutput = await res.json();     
      Object.entries(detailOutput.Rubrics).forEach((entry : any) => {
        let code = entry[1].Code;
        let period = entry[1].Period;
        if(code == "10/15" && period == "N") {
          let vermogen = entry[1].Value;
          BedrijfPropsOutput.eigenVermogen= vermogen;
        }
        if(code == "17/49" && period == "N") {
           var schulden = entry[1].Value;
           BedrijfPropsOutput.schulden= schulden;
        }
        if(code == "9901" && period == "N") {
          var bedrijfswinst = entry[1].Value;
          BedrijfPropsOutput.bedrijfswinst= bedrijfswinst;
        }    
      });
    return (BedrijfPropsOutput);
  };
  } catch (err) {
    console.error(err);
  }
});

const generalAPIInput = (async (number : string )  => {
    try {
      let res  = await  fetch('https://ws.uat2.cbso.nbb.be/authentic/legalEntity/' + number + '/references', {
        headers:{
            'Accept' : 'application/json',
            'NBB-CBSO-Subscription-Key' :'de631b01365f42c49905b547f272af74',
            'X-Request-Id':''
        }});
      let financialData;
      if (res.status >= 400) {
        const bedrijf_1 =  new Bedrijf("Onbestaande","Onbestaande","Onbestaande", new Address("", "","Onbestaande",""),"Onbestaande","Onbestaande","Onbestaande");
        return bedrijf_1;
      }  else{
      const generalData = await res.json();
     financialData =  await  DetailAPIInput(generalData[0].ReferenceNumber);
     let eigenVermogen : any = financialData?.eigenVermogen;
     let schulden : any = financialData?.schulden; 
     let bedrijfswinst : any = financialData?.bedrijfswinst; 
      const bedrijf_1 =  new Bedrijf(generalData[0].ReferenceNumber,generalData[0].EnterpriseName, generalData[0].DepositDate, 
        new Address( generalData[0].Address.City,generalData[0].Address.PostalCode,generalData[0].Address.Street, generalData[0].Address.Number),
        eigenVermogen, schulden, bedrijfswinst);
      return bedrijf_1;
    };
    } catch (err) {
      console.error(err);
    }
  });

  
  
  const storeInDb = (async(data : any, data_2 : any) => {
    const currentTime = new Date().toDateString();
    try{
      //database insert
      if(data?.name != "Onbestaande"){
        if(data != undefined){
          data.opzoekDatum= currentTime;
          await client.db(DATABASE).collection(COLLECTION).insertOne(data);
      }
    }
    if(data_2?.name != "Onbestaande"){
      if(data_2 != undefined){
        data_2.opzoekDatum= currentTime;
        await client.db(DATABASE).collection(COLLECTION).insertOne(data_2);
      } 
    }
     }catch(exc){
          console.log(exc);
     } 
  });


app.get('/',(req:any,res:any)=>{
    res.render('index');
   
});

app.get('/bedrijfOutput',(req:any,res:any)=>{
  res.render('bedrijfOutput');
 
});

app.get('/bedrijfOutput/:x/:y', async(req:any,res:any) => {
  let x = req.params.x;
  let y = req.params.y;
  let data = await generalAPIInput(x);
  let data_2 = await generalAPIInput(y);
  storeInDb(data,data_2);
    res.render('bedrijfOutput',{bedrijfOutput: await data, bedrijfOutput_2 : await data_2} )
});


const renderBedrijven= async (res:any) => {
  let cursorAll = await client.db(DATABASE).collection(COLLECTION).find({});
      let bedrijvenAll = await cursorAll.toArray();
      res.render('history' ,{bedrijven: bedrijvenAll});
}
app.get('/history', async (req:any,res:any)=>{
  try{
    renderBedrijven(res);

}catch(exc){
        console.log(exc);
}

});

app.get('/history/:x', async(req:any,res:any)=>{
  let x = req.params.x;
    let bedrijfX = await client.db(DATABASE).collection(COLLECTION).findOne( { referenceNumber : x} );
  res.render('history_detail', {bedrijf : bedrijfX});
});

app.listen(app.get('port'), ()=>console.log( '[server] http://localhost:' + app.get('port')));




export {};