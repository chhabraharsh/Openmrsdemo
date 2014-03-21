
/////////////////////////////////////////////////////////////////////////////
//  OpenMRS Rest Calls Module
//  Created by @Harsh
//
// MODULE DESCRIPTION: 
// This module implements the different Rest call using OpenMRS API
// 
// MODIFICATION/HISTORY:
//
// 
//
//
/////////////////////////////////////////////////////////////////////////////



var OPENMRS_REST_HOST = 'http://raxaemr.elasticbeanstalk.com';
localStorage.setItem("basicAuthHeader", "Basic cGl5dXNoZGFuZTpIZWxsbzEyMw===");
 
var result = null;

// More information about the consumed Data : 
//https://raxaemr.atlassian.net/wiki/display/RAXAJSS/Raxacore+REST+resources#RaxacoreRESTresources-Encounter 


//Fetch Observation resource 
var REST_OBS = '/ws/rest/v1/obs?patient=65ea509b-1f90-461f-9879-62004cc8a3b6';

//Fetch Drug resource
var REST_Drug = '/ws/rest/v1/raxacore/drug?q=ELMECOB';

//"Diastolic Blood Pressure"  
var REST_concept = '/ws/rest/v1/concept/1ca738cc-f770-11e1-a276-f23c91ae55df?v=full';

//Fetch Alerts belonging to patient
var Rest_Alert = '/ws/rest/v1/raxacore/raxaalert?patient=bac7d787-b99d-5167-789b-e5e2231aedf5';


//Fetch Vital signs 
var Rest_VitalSigns = '/ws/rest/v1/obs?patient=bac7d787-b99d-5167-789b-e5e2231aedf5';


//Get List of Patients 
var REST_PatientList = '/ws/rest/v1/raxacore/patientlist?q' ;

//Get an Encounte
var REST_Encounter = '/ws/rest/v1/raxacore/encounter?patient=65ea509b-1f90-461f-9879-62004cc8a3b6';

//Get Medical Images  
var Rest_MedicalImages = '/ws/rest/v1/raxacore/image?patient=65ea509b-1f90-461f-9879-62004cc8a3b6';


//This list to ditnguish the vital signs from other observations .

var list_VitalSigns = ["PULSE" , "TEMPERATURE" , "BLOOD OXYGEN SATURATION","RESPIRATORY RATE","DIASTOLIC BLOOD PRESSURE","SYSTOLIC BLOOD PRESSURE",];

//This main array to store the different block in order to show them later .
 var timeline_data =[]; //declare object
 var timeline_elem ={};

//This is to add more features in the future to costumize our timeline 

   Features       = {
        order: "desc"
    };

// Hard coded for now, so you won't have to login via our app
var Util = {
    getBasicAuthHeaders: function () {
        var headers = {
            "Authorization": localStorage.getItem("basicAuthHeader"),
                "Accept": "application/json",
                "Content-Type": "application/json"
        };
        return headers;
    },
    ISODateString: function (d) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z';
    }
}


 /**
    We are defining here the different Urls available on our Raxa Server 
    This main function helps us to reduce code , Each "rest_url" refers 
    to a specific resource which needs to be be costumized to visualize it in a block 
*/

var omrsRestCall = function (rest_url,callback,Criteria) {
    $.ajax({
       
        url: OPENMRS_REST_HOST + rest_url,
        type: 'GET',
         async: false ,
        dataType: 'json',
        contentType: "application/json",
        beforeSend: function (xhr) {
            var headers = Util.getBasicAuthHeaders();
            for (key in Util.getBasicAuthHeaders()) {
                console.log(headers[key]);
                xhr.setRequestHeader(key, headers[key]);
            }
        },
        success: function (data) { 
                callback(data,Criteria);
              
        }
}); }



 /**
     * Fetch the drug information. This method allows to
     * retrieve all node information in one call to optimize performance.

*/


var drug_fun = function (data,Criteria) {
           console.log(data);
    var $htmlstring = $('<ul/>');
    var drugElementsList = []; //declare object
    var drugElement = {};

    $.each(data.results , function (i, item) { // on this line
        console.log(item);
        drugElement = {   type:'Medication_block',
                            date:     '2013-08-07',
                            ElementType: "Medication",
                            category :"MEDICATION",
                            MedicationName:item.fullName,
                            Name:item.name ,
                            genericName:item.genericName,
                            RateQuantity : item.units,
                            dosageForm: item.dosageForm ,
                            doseStrength: item.doseStrength,          
                            packetInfo: item.packetInfo,
                            price: item.price , 
                            url:'http://fb.com'
                     };
        timeline_data.push(drugElement);
    });


    var timeline = new Timeline($('#timeline'), timeline_data);

    timeline.AffichertimelineWithCriteria(Criteria);

};


 /**
     * Fetch the Observation information. This method allows to
     * retrieve all node information in one call to optimize performance.

*/


var observations_fun = function (data,Criteria) {
    
         console.log(data);
         var $htmlstring=$('<ul/>');
         console.log($htmlstring);
         var observationElement = {};
       
    $.each(data.results , function (i, item) { // on this line
        console.log(item);

        if( $.inArray(item.concept.display , list_VitalSigns) > -1 ) 
        {
        vitalsignsElement = {       
                                    type:'VitalSigns_block', 
                                    date: "2000-01-01",  
                                    ElementType: "Vital Sign",
                                    category : "VitalSigns",
                                  
                                   
                                    name:item.concept.display ,  
                                    value : item.value,
                                    obsDatetime :item.obsDatetime,
                                    obsGroup :item.obsGroup ,

                                    url:'http://google.com'
                            };
       
        timeline_data.push(vitalsignsElement);
       
        }
        else
        {
       
        observationElement = {      type:'Observation_block',
                                    date:  '2013-08-07', // item.fullName,
                                    ElementType: "Observation",
                                    category :"History",

                                    Patient: item.person.display ,
                                    PatientNumber: item.person.uuid ,
                                    MedicalImage: item.value ,
                                    Concept:item.concept.display ,
                                    //Encounter:item.encounter.display,
                                    location:item.location,
                                    obsDatetime:item.fullName,
                                    obsGroup:item.name ,
                                    order:item.genericName,
                                    image:item.value,
                                    url:'http://google.com'
                             };
        timeline_data.push(observationElement);

        }
    });


     var timeline = new Timeline($('#timeline'), timeline_data);

    // timeline.AffichertimelineWithCriteria(Criteria);

    timeline.Affichertimeline();
  // return timeline_data ;

};
    

 /**
     * Fetch the Medical Images . This method allows to
     * retrieve all node information in one call to optimize performance.

*/


var MedicalImages_fun = function (data,Criteria) {
        console.log(data);
        var $htmlstring=$('<ul/>');
        console.log($htmlstring);
        var MedicalImgElement = {};

         $.each(data.results, function(i,item){ // on this line

                var MedicalImgElement = { id:item.conceptUuid , 
                                type:'MedicalImages_block',
                                date:     '2012-08-30',
                                ElementType: "MedicalImages",
                                category :"MedicalImages",
                                title:     item.title ,
                                MedicalImageName : item.dataURI ,     
                                Provider :item.provider ,                   
                                ImageType:null,
                                image: item.dataURI,
                                Note :null , 
                                images: [],
                                url:'http://google.com'     
                 };
           timeline_data.push(MedicalImgElement);
          });
            
    var timeline = new Timeline($('#timeline'), timeline_data);

      timeline.AffichertimelineWithCriteria(Criteria);

};



 /**
     * Fetch the Encoutnters . This method allows to
     * retrieve all node information in one call to optimize performance.

*/


var Encounter_fun = function (data,Criteria) {
    
        console.log(data);
        var $htmlstring=$('<ul/>');
        console.log($htmlstring);
   
        var EncounterElement = {};

         $.each(data.results, function(i,item){ // on this line

               EncounterElement = {id:item.uuid , 
        
                                    type:'Encounter_block',
                                    date:     '2013-08-04',
                                    ElementType: "Encounter",
                                    category :"CarePlan",
                                    title:    'Encounter Post',
                                    EncounterName: item.encounterType.display ,
                                    PlannedDate: item.encounterDatetime ,
                                   // Provider:item.provider.display,

                                    Location:null ,
                                    Note :null , 
                                    url:'http://google.com'
                 };
            timeline_data.push(EncounterElement);
          });
   
    var timeline = new Timeline($('#timeline'), timeline_data);
     timeline.AffichertimelineWithCriteria(Criteria);

         
};



 /**
     * Fetch different types from one Encoutner . This method allows to
     * retrieve all node information in one call to optimize performance.

*/

var GetDifferentTypes_Encounter = function (data) {
    
        console.log(data);
        var $htmlstring=$('<ul/>');
        console.log($htmlstring);
   
        var EncounterElement = {};
        var observationElement= {};
        var orderElement= {};

         $.each(data.results, function(i,item){ // on this line

               
                var ObsList = item.obs ;
                var orderList = item.orders;
                var PatientName = item.patient.display;
                var imagesList = item.images;

               EncounterElement = {id:item.uuid , 
        
                                    type:'Encounter_block',
                                    date:     '2013-08-04',
                                    ElementType: "Encounter",
                                    category :"CarePlan",
                                    title:    'Encounter Post',
                                    PatientName: item.patient.display,

                                    EncounterName: item.encounterType.display ,
                                    PlannedDate: item.encounterDatetime ,
                                   // Provider:item.provider.display,

                                    Location:null ,
                                    Note :null , 
                                    url:'http://google.com'
                 };

    if (typeof(orderList) !== "undefined") {
            $.each(orderList , function(i,val){ // on this line
               orderElement = {     type:'Order_block',
                                    date:  '2013-08-07', // item.fullName,
                                    ElementType: "Order",
                                    category :"History",
                                    Patient: PatientName,
                                    drug : val.drug.display,
                                    units: val.units,
                                    dose:val.dose,
                                    frequency: val.frequency,
                                    quantity: val.quantity,
                                    autoExpireDate:val.autoExpireDate,
                                    startDate:val.startDate,
                                    url:'http://google.com'
                             };

            timeline_data.push(orderElement);
          });
            };
    
    if (typeof(ObsList) !== "undefined") {
         $.each(item.obs , function(i,value){ // on this line
              observationElement = {type:'Observation_block',
                                    date:  '2013-08-07', // item.fullName,
                                    ElementType: "Observation",
                                    category :"History",

                                    Patient: PatientName,
                                    Concept:value.concept.conceptClass.name,
                                    ConceptDescription:value.concept.conceptClass.description,
                                    dataType:value.concept.datatype.name,
                                    DataTypeDescription:value.concept.datatype.description,
                                    obsDatetime: value.obsDatetime,
                                    order:item.order,
                                    image:item.value,
                                    url:'http://google.com'
                             };

           timeline_data.push(observationElement);
          });
    };

    if (typeof(imagesList) !== "undefined") {
       
         $.each(imagesList, function(i,item){ // on this line

                var MedicalImgElement = { id:item.conceptUuid , 
                                type:'MedicalImages_block',
                                date:     '2012-08-30',
                                ElementType: "MedicalImages",
                                category :"MedicalImages",
                                title:     item.title ,
                                MedicalImageName : item.dataURI ,     
                              //  Provider :item.provider ,                   
                              //  ImageType:null,
                                image: item.dataURI,
                                Note :null , 
                                images: [],
                                url:'http://google.com'     
                 };
           timeline_data.push(MedicalImgElement);
          });
            
    };
    

        timeline_data.push(EncounterElement);

          });
   
    var timeline = new Timeline($('#timeline'), timeline_data);
     timeline.Affichertimeline();

         
};


/**
     * Fetch the Alert Signs . This method allows to
     * retrieve all node information in one call to optimize performance.

*/

var Alert_fun =function (data,Criteria) {
    
         console.log(data);
         var $htmlstring=$('<ul/>');
         console.log($htmlstring);
        var jsonList = []; //declare object
      var jsonObj = {};

         $.each(data.results, function(i,item){ // on this line

            AlertElement ={id:item.uuid , 
                        ElementType: "Alert_Sign",
                        category :"Alert_Sign",
                        date: "2000-01-01",
                        alertType: item.alertType ,
                        defaultTask: item.defaultTask ,
                        description : item.description,
                        Name : item.name,
                            
                 };

            timeline_data.push(AlertElement);
        
          });
    
    var timeline = new Timeline($('#timeline'), timeline_data);
       timeline.AffichertimelineWithCriteria(Criteria);
         
};





 /**
     Loading Data 
*/

function LoadAllData() {

    //Creating the new timeline 
    var timelineContainer = $('#timeline_container')
    var documentBody = $(document.body);
   
    // Remove old timeline
    $('#timeline').remove();

    // Create a new timeline
    var appending = $('<div>').attr('id', 'timeline').appendTo(timelineContainer);
    var timeline_data = [];
    var Features = {};


    $('#timeline').addClass('TimelineContainer');


    //I am trying to wrap different functions here , but by adding filtering creteria 
    omrsRestCall(Rest_VitalSigns ,observations_fun );
  
  //  omrsRestCall(REST_Drug,drug_fun,"Medication");  
    omrsRestCall(REST_OBS ,observations_fun,"Observation");
    omrsRestCall(REST_Encounter ,Encounter_fun,"Encounter");
    omrsRestCall(Rest_MedicalImages ,MedicalImages_fun,"MedicalImages");
  //  omrsRestCall(Rest_Alert ,Alert_fun,"Alert_Sign");
    omrsRestCall(REST_Encounter ,GetDifferentTypes_Encounter);
    


}


/*
Load data ; To fetch All the elements 
*/

function LoadData() {

    //Creating the new timeline 
    var timelineContainer = $('#timeline_container')
    var documentBody = $(document.body);
   
    // Remove old timeline
    $('#timeline').remove();

    // Create a new timeline
    var appending = $('<div>').attr('id', 'timeline').appendTo(timelineContainer);
    var timeline_data = [];
    var Features = {};

    
    $('#timeline').addClass('TimelineContainer');
         

}

/**
     *  This method allows to filter the data that we etrieve 
     from different calls to optimize performance.

*/

function LoadSpecificData(timeline_data,creteria) {

    //Creating the new timeline 
    var timelineContainer = $('#timeline_container')
    var documentBody = $(document.body);
   
    // Remove old timeline
    $('#timeline').remove();

    // Create a new timeline
    var appending = $('<div>').attr('id', 'timeline').appendTo(timelineContainer);
    var new_timeline = [];
    var Features = {};

    $.each(timeline_data, function(i,item){ // on this line

        if (item.ElementType == creteria){
        new_timeline.push(item);
        };
          });


    
    $('#timeline').addClass('TimelineContainer');

    var timeline = new Timeline($('#timeline'), new_timeline);
    timeline.Affichertimeline();
         

}





$(document).ready(function() {
    //Loading Data
  
    LoadAllData();    

    // Creating a Facebook-like tooltips effect based on an anchor tag's title attribute.Tipsy is a jQuery plugin 
    $("#LabResults-Btn").tipsy({gravity: 'w'});
    $('#history-Btn').tipsy({gravity: 'w'});
    $('#medication-Btn').tipsy({gravity: 'w'});
    $("#CarePlan-Btn").tipsy({gravity: 'w'});
    $("#VitalSigns-Btn").tipsy({gravity: 'w'});
    $("#MedicalImages-Btn").tipsy({gravity: 'w'});
 
 //   $("#LabResults-Btn").tipsy({gravity: 'w'});
 //   $("#immutization-Btn").tipsy({gravity: 'w'});
 

  $("#LabResults-Btn").click(function() {
  //Creating the new timeline 
    var timelineContainer = $('#timeline_container')
    var documentBody = $(document.body);
   
    // Remove old timeline
    $('#timeline').remove();

    // Create a new timeline
    var appending = $('<div>').attr('id', 'timeline').appendTo(timelineContainer);
 
    var Features = {};
    
    $('#timeline').addClass('TimelineContainer');

    var timeline = new Timeline($('#timeline'), timeline_data);
    timeline.Affichertimeline();
       }); 


$("#history-Btn").click(function() {
  LoadSpecificData(timeline_data,"Observation")
       }); 

$("#medication-Btn").click(function() {
  LoadSpecificData(timeline_data,"Order")
       }); 


$("#CarePlan-Btn").click(function() {
  LoadSpecificData(timeline_data,"Encounter")
   }); 

$("#VitalSigns-Btn").click(function() {
  LoadSpecificData(timeline_data,"Vital Sign")
   }); 

$("#MedicalImages-Btn").click(function() {
  LoadSpecificData(timeline_data,"MedicalImages")
   }); 



//Fancy Box to visulize the 

$(".img_container").fancybox({
 'type':'iframe',
 'width': 900, //or whatever you want
 'height': 900
});
});

