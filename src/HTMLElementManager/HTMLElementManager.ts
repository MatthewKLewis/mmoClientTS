export class HTMLElementManager {

    hudDiv: HTMLDivElement | null  
    logsDiv: HTMLDivElement | null    
    healthDiv: HTMLDivElement | null  
    loadingScreenDiv: HTMLDivElement | null  

    constructor() {
        this.hudDiv = document.querySelector("#hud");
        this.loadingScreenDiv = document.querySelector("#loading-screen");

        //Health
        var hD = document.createElement("div");
        hD.innerText = "Health"
        hD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; left: 1em; text-align: left; color: white; z-index:2");
        this.healthDiv = this.hudDiv && this.hudDiv.appendChild(hD);    
        
        //Logs
        var lD = document.createElement("div");
        lD.id = "logs-div"
        lD.innerText = "Logs:"
        lD.setAttribute('style', "padding: 0; margin: 0; position: fixed; top: 1em; right: 1em; text-align: right; color: white; z-index:2");
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

    showHideLoader(show: boolean) {
        if (show) {
            this.loadingScreenDiv?.classList.add('show')
            this.loadingScreenDiv?.classList.remove('hide')
        } else {
            this.loadingScreenDiv?.classList.add('hide')
            this.loadingScreenDiv?.classList.remove('show')
        }
    }
}