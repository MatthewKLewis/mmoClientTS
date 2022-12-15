export class HTMLElementManager {

    hudDiv: HTMLDivElement | null  
    loadingScreenDiv: HTMLDivElement | null  

    nameDiv: HTMLDivElement | null  
    healthDiv: HTMLDivElement | null  
    xyzDiv: HTMLDivElement | null  

    constructor() {
        this.hudDiv = document.querySelector("#hud");
        this.loadingScreenDiv = document.querySelector("#loading-screen");

        this.nameDiv = document.querySelector("#name");
        this.healthDiv = document.querySelector("#health");
        this.xyzDiv = document.querySelector("#xyz");
        
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

    update(name: string, uuid: string, health: number, x: number, y: number, z: number) {
        if (this.nameDiv) {
            this.nameDiv.innerText = name + " " + uuid;
        }
        if (this.healthDiv) {
            this.healthDiv.innerText = health.toString();
        }
        if (this.xyzDiv) {
            this.xyzDiv.innerText = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)},`;
        }
    }
}