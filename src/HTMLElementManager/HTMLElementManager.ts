export class HTMLElementManager {

    hudDiv: HTMLDivElement | null  
    logsDiv: HTMLDivElement | null    
    healthDiv: HTMLDivElement | null  
    spinnerDiv: HTMLDivElement | null  

    constructor() {
        this.hudDiv = document.querySelector("#hud");
        this.spinnerDiv = document.querySelector("#spinner");

        //Health
        var hD = document.createElement("div");
        hD.innerText = "Health"
        hD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; left: 1em; text-align: left; color: white; z-index:9999");
        this.healthDiv = this.hudDiv && this.hudDiv.appendChild(hD);    
        
        //Logs
        var lD = document.createElement("div");
        lD.id = "logs-div"
        lD.innerText = "Logs:"
        lD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; right: 1em; text-align: right; color: white; z-index:9999");
        this.logsDiv =  this.hudDiv && this.hudDiv.appendChild(lD);
        
        console.log("HTML Manager Built")
        this.addAdminLog("First Log")
    }

    addAdminLog(text: string) {
        var newLog = document.createElement("p")
        newLog.innerText = text
        var logsDiv = document.querySelector('#logs-div')
        logsDiv && logsDiv.appendChild(newLog)
    }

    showHideSpinner(show: boolean) {
        if (show) {
            this.spinnerDiv?.classList.add('show')
            this.spinnerDiv?.classList.remove('hide')
        } else {
            this.spinnerDiv?.classList.add('hide')
            this.spinnerDiv?.classList.remove('show')
        }
    }
}