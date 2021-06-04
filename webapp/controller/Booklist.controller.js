  
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.Booklist", {

        onDeleteBook(oEvent) {
            const aSelContexts = this.byId("idBooksTable").getSelectedContexts()
            console.log(aSelContexts)

            const sPathToBook = aSelContexts[0].getPath();
            console.log(sPathToBook)
            this.getView().getModel().remove(sPathToBook);
        },

        onAddBook(oEvent) {
            if(!this.dialog){
            this.dialog = sap.ui.xmlfragment("addBook", "org.ubb.books.view.add", this);
            }
            this.dialog.open();
        },

        onClosePressed(oEvent) {
            this.dialog.close();
        },
        onSavePressed(oEvent) {
            var oISBN = sap.ui.getCore().byId("addBook--idIsbn").getValue();
            var oTitle = sap.ui.getCore().byId("addBook--idTitle").getValue();
            var oAuthor = sap.ui.getCore().byId("addBook--idAuthor").getValue();
            var oLanguage = sap.ui.getCore().byId("addBook--idLanguage").getValue();
            var oDate = sap.ui.getCore().byId("addBook--idDate").getDateValue();
            var oTotal = sap.ui.getCore().byId("addBook--idTotalBooks").getValue();
            var oAvailable = sap.ui.getCore().byId("addBook--idAvailableBooks").getValue();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
            var date = new Date(oDate);
            var dateFormatted = dateFormat.format(oDate);

            var oBook = {
                "Isbn": oISBN,
                "Title": oTitle,
                "Author": oAuthor,
                "Language": oLanguage,
                "PublishDate": dateFormatted,
                "TotalBooks": parseInt(oTotal),
                "AvailableBooks": parseInt(oAvailable)
            };

            this.odataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY2_GAAL_SRV");
            this.odataModel.create('/BookSet', oBook);
            this.dialog.close();
            this.dialog.destroy();
            alert("Added Successfully");
            window.location.reload();
        },

        onUpdateBook(oEvent) {
            var oTable = this.getView().byId("idBooksTable");
            var selectedItem = oTable.getSelectedItem();

            var isbn = selectedItem.getBindingContext().getProperty("Isbn");
            var title = selectedItem.getBindingContext().getProperty("Title");
            var author = selectedItem.getBindingContext().getProperty("Author");
            var language = selectedItem.getBindingContext().getProperty("Language");
            var date = selectedItem.getBindingContext().getProperty("PublishDate");
            var total = selectedItem.getBindingContext().getProperty("TotalBooks");
            var available = selectedItem.getBindingContext().getProperty("AvailableBooks");

            if(!this.dialog)
            {
                this.dialog = sap.ui.xmlfragment("updateBook", "org.ubb.books.view.update", this);
            }
            this.dialog.open();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MMM dd, yyyy" });
            var date1 = new Date(date);
            var dateFormatted = dateFormat.format(date1);

            sap.ui.getCore().byId("updateBook--idIsbn").setValue(isbn);
            sap.ui.getCore().byId("updateBook--idTitle").setValue(title);
            sap.ui.getCore().byId("updateBook--idAuthor").setValue(author);
            sap.ui.getCore().byId("updateBook--idLanguage").setValue(language);
            sap.ui.getCore().byId("updateBook--idDate").setValue(dateFormatted);
            sap.ui.getCore().byId("updateBook--idTotalBooks").setValue(total);
            sap.ui.getCore().byId("updateBook--idAvailableBooks").setValue(available);
        },

        onUpdatePressed(oEvent) {
            var oISBN = sap.ui.getCore().byId("updateBook--idIsbn").getValue();
            var oTitle = sap.ui.getCore().byId("updateBook--idTitle").getValue();
            var oAuthor = sap.ui.getCore().byId("updateBook--idAuthor").getValue();
            var oLanguage = sap.ui.getCore().byId("updateBook--idLanguage").getValue();
            var oDate = sap.ui.getCore().byId("updateBook--idDate").getValue();
            console.log(oDate)
            var oTotal = sap.ui.getCore().byId("updateBook--idTotalBooks").getValue();
            var oAvailable = sap.ui.getCore().byId("updateBook--idAvailableBooks").getValue();

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
            var date = new Date(oDate);
            var dateFormatted = dateFormat.format(date);

            var oBook = {
                "Isbn": oISBN,
                "Title": oTitle,
                "Author": oAuthor,
                "Language": oLanguage,
                "PublishDate": dateFormatted,
                "TotalBooks": parseInt(oTotal),
                "AvailableBooks": parseInt(oAvailable)
            };
            console.log(oBook)
            this.odataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/Z801_LIBRARY2_GAAL_SRV");
            this.odataModel.update("/BookSet('" + oISBN + "')", oBook, null, function () {
                alert("Update successful");
            }, function () {
                alert("Error!");
            }
            );

            this.dialog.close();
            this.dialog.destroy();
            window.location.reload();
        },
        onBorrow(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("borrow");
        },
        onSearch(){
            var oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("search");
        }
    });
});