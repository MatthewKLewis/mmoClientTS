export class HTMLElementManager {

    logsDiv: HTMLDivElement | null    
    healthDiv: HTMLDivElement | null  

    constructor() {
        const element = document.querySelector("#hud");

        //Health
        var hD = document.createElement("div");
        hD.innerText = "Health"
        hD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; left: 1em; text-align: left; color: white; z-index:9999");
        this.healthDiv = element && element.appendChild(hD);    
        
        //Logs
        var lD = document.createElement("div");
        lD.id = "logs-div"
        lD.innerText = "Logs:"
        lD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; right: 1em; text-align: right; color: white; z-index:9999");

        this.logsDiv =  element && element.appendChild(lD);    
        
        console.log("HTML Manager Built")
        this.addAdminLog("First Log")
    }

    addAdminLog(text: string) {
        var newLog = document.createElement("p")
        newLog.innerText = text
        var logsDiv = document.querySelector('#logs-div')
        logsDiv && logsDiv.appendChild(newLog)
    }
}