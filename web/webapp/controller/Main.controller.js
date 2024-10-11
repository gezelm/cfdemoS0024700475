sap.ui.define([
    "com/xtendhr/web/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ui/core/library",
],
function (Controller, MessageToast, MessageBox,  Dialog, Button, Text, JSONModel) {
    "use strict";

    return Controller.extend("com.xtendhr.web.controller.Main", {
        onInit: function () {

            var url = "/srv/destinations?destinationX=sfodatatech&path=odata/v2/cust_CompanyShirts_S0024700475"
            this.onCallSRV (url, "GET", "application/json", true, "odata", this)
        },

        
        
        //get
        onCallSRV: function(path, type, cont, enableAsync, oModel, opt){   
            var self = opt;
            $.ajax({
                url: path,
                type: type,
                contentType:cont ,
                async: enableAsync, 
                beforeSend: function () {
					self.getView().setBusy(true);
				},
                success: function(data){ 
                    switch (type){
                        case "GET":
							if(oModel === "shirt"){
								self.getView().setModel(self.createModel(data.d.results[0]), oModel);

							}else{
								self.getOwnerComponent().getModel(oModel).setData(data);
								self.getView().getModel(oModel);							
							}
								
                            break;   
                        case "DELETE":
                            self.initialData();
                            MessageToast.show("Deleted")
                        break;                       
                    }  
                    self.getView().setBusy(false);           
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                    self.getView().setBusy(false);    
                }
            });
            
        },

        //put
        onDetails: function (oEvent) {

            var oItem = oEvent.getSource();
			var sPath = oItem.getBindingContext("odata").sPath;
			var sObjectId = sPath.split("/");
            var index =  sObjectId[3];
			this.oSelectedItem = oItem;
		;
            this.getRouter().navTo("Details", this.getDetails(oEvent));
		},

        //put
        getDetails:function(oEvent){
            var oItem = oEvent.getSource();
			var sPath = oItem.getBindingContext("odata").sPath;
			var sObjectId = sPath.split("/");
			this.oSelectedItem = oItem;
            var index =  sObjectId[3];
            var externalCode= this.getView().getModel("odata").getProperty("externalCode", oEvent.getSource().getBindingContext("odata"));
         
            return {
                objectId: index,
                externalCode: externalCode
            }
        },

        onAddNewEntry:function(){         
            this.onCreateDialog();         
        },

         //create
        onCreateDialog: function () {
			if (!this.oMPDialog) {
				this.oMPDialog =                
                
                
                this.loadFragment({
					name: "com.xtendhr.web.view.fragments.NewShirt"
				});
			}
			this.oMPDialog.then(function (oDialog) {
				this.oDialog = oDialog;
				this.oDialog.open();		
			}.bind(this));
		},

        onCloseDialog: function () {
			this.oDialog.close();
		},

         //create
        onSubmit: function(oEvent){

            let newModel= new JSONModel({
                cust_ShirtSize: "CC_Black",
                cust_ShirtColor: "SS_Large"
            });
            
            this.getView().setModel(newModel, "newShirt");

			//this.getView().setModel(newModel, "newShirt");
            
            var url = "/srv/add?destinationX=sfodataapi&path=odata/v2/cust_CompanyShirts_S0024700475?$format=json"
            //var obj = this.getView().getModel("newShirt").getData();
            this.onCreateSRV(url, "POST", "application/json", obj, true);
            this.onCloseDialog();

        },

         //create
         onCreateSRV: function(_url, type, cont, obj, enableAsync){     
            var self = this;                
            $.ajax({
                url: _url,
                type: type,
                contentType:cont ,
                data: JSON.stringify(obj) ,                
                async: enableAsync,
                beforeSend: function () {
					self.getView().setBusy(true);
                   
				},
                success: function(data){                   
                    switch (type){
                        case "POST":
                           self.getView().getModel("odata");
                           self.initialData();                                              
                    }
                    self.getView().setBusy(false);                              
                },
                error:function(error){
                    MessageToast.show("Web Service error");
                    self.getView().setBusy(false);
                }
            });
            
        }

    });
});
