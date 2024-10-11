sap.ui.define(
    [
        "com/xtendhr/web/controller/BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/m/Dialog",
        "sap/m/library",
        "sap/m/Button",
        "sap/m/Text",
        "sap/ui/model/json/JSONModel",
        "sap/m/Label",
    ],
    function(Controller, MessageToast,MessageBox,Dialog, mobileLibrary, Button, Text, JSONModel ) {
      "use strict";
    // shortcut for sap.m.ButtonType
	//var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	//var DialogType = mobileLibrary.DialogType;
  
      return Controller.extend("com.xtendhr.web.controller.Details", {
        onInit: function(evt) {

            var oRouter = this.getRouter();
            oRouter.getRoute("Details").attachMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {	
			var oArgs;
			oArgs = oEvent.getParameter("arguments");		
			var eventId = oArgs.objectId;
			var eventData = this.getOwnerComponent().getModel("odata").getData().d.results[eventId];
			this.initialData(eventData.externalCode);		
		},

        initialData:function(externalCode){
			var url = "/srv/destinations?destinationX=sfodatatech&path=odata/v2/cust_CompanyShirts_S0024700475?$filter=externalCode eq '" + externalCode +"'&$format=json"
			this.onCallSRV(url, "GET","application/json",  true, "shirt", this)
		},
        

        //edit
        onSave: function(oEvent){
			var oData = this.getView().getModel("shirt").getData();
         
            var metadata = this.generateMetadata(oData);
            var url = "/srv/edit?destinationX=sfodataapi&path=odata/v2/cust_CompanyShirts_S0024700475/upsert";     
            this.onEditSRV(url, "POST", "application/json", metadata);

            this.onCancel();
			this.getView().getModel().refresh(true);
            
		},

        //edit
        generateMetadata:function(params) {
            var metadata=
                {
                    "__metadata": {
                        "uri": "https://apisalesdemo2.successfactors.eu/odata/v2/cust_CompanyShirts_S0024700475("+ params.externalCode+ "L)",
                        "type": "SFOData.cust_CompanyShirts_S0024700475"
                    },
                  
                    "cust_ShirtSize": params.cust_ShirtSize,
                    "cust_ShirtColor": params.cust_ShirtColor
                };            
                return metadata;           
        },

        //edit
        onEditSRV: function(_url, type, cont, obj, enableAsync){     
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
                           console.debug(data);
                            
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

        onDelete:function(oEvent){
			var extCode= this.getView().getModel("shirt").getData().externalCode;
            var url = "/srv/delete?destinationX=sfodataapi&path=odata/v2/cust_CompanyShirts_S0024700475("+ extCode +"L)";           
			this.onCallSRV(url, "DELETE", "application/json", true, "shirt", this);
			this.onCancel ();
							
        },

        //delete
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
                            //self.initialData();
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

        onCancel: function () {
			//this.cleardata();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main", {}, true /*no history*/ );	

		},

      });
    }
  );
  