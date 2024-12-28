document.addEventListener("DOMContentLoaded", () => {
    let pnrInput = document.getElementById("pnr-input")
    let pnrSubmitBtn = document.getElementById("pnr-submit-btn")
    let pnr = 0
    const welcomePage = document.getElementById("welcome-container")
    const resultPage = document.getElementById("result-container")
    const errorPage = document.getElementById("error-container")

    pnrSubmitBtn.addEventListener('click', async ()=> {
        pnr = pnrInput.value;
        if(!pnr) return
        console.log("Number submitted successfully");
        console.log(pnr);
        const result = await fetchPnrStatus(pnr)   
        renderResult(result)     
    })
    
    async function fetchPnrStatus(pnr){
        const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '31436c3d52msh415f3095bff5cc0p12baefjsnc77176dc4655',
                'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const resultString = await response.text();    
            const result = await JSON.parse(resultString)
            console.log(result);
            console.log(result.success);
            return result;

            // TEST CASE
            // return {"success":true,"data":{"pnrNumber":"4916218530","dateOfJourney":"Jan 11, 2025 12:45:46 PM","trainNumber":"22659","trainName":"KCVL YNRK SF EX","sourceStation":"BSR","destinationStation":"RK","reservationUpto":"RK","boardingPoint":"BSR","journeyClass":"2A","numberOfpassenger":1,"chartStatus":"Chart Not Prepared","informationMessage":["",""],"passengerList":[{"passengerSerialNumber":1,"passengerFoodChoice":"","concessionOpted":false,"forGoConcessionOpted":false,"passengerIcardFlag":false,"childBerthFlag":false,"passengerNationality":"IN","passengerQuota":"GN","passengerCoachPosition":0,"waitListType":12,"bookingStatusIndex":0,"bookingStatus":"RLWL","bookingCoachId":"","bookingBerthNo":3,"bookingStatusDetails":"RLWL/3","currentStatusIndex":0,"currentStatus":"CNF","currentCoachId":"","currentBerthNo":0,"currentStatusDetails":"CNF"}],"timeStamp":"Dec 26, 2024 6:08:46 PM","bookingFare":2490,"ticketFare":2490,"quota":"GN","reasonType":"S","ticketTypeInPrs":"E","vikalpStatus":"No","waitListType":0,"bookingDate":"Sep 28, 2024 12:00:00 AM","arrivalDate":"Dec 27, 2024 11:26:46 AM","mobileNumber":"","distance":1539,"isWL":"N"},"generatedTimeStamp":1735216726902};
            
        } catch (error) {
            console.log("Error aya hai");
            
            console.error(error);
        }
    }
    
    function renderResult(resultContent){
        console.log(resultContent);
        
        if(resultContent.success === false){
            console.log(resultContent.success);
            
            welcomePage.classList.add("hidden");
            errorPage.classList.add("flex");
            errorPage.classList.remove("hidden");
            document.getElementById("error-text-field").innerText = resultContent.message
        }else{
            console.log(resultContent.success);
            welcomePage.classList.add("hidden");
            resultPage.classList.remove("hidden");
            resultPage.classList.add("flex");
            renderSuccessPage(resultContent);
        }
    }

    function renderSuccessPage(resultContent){
        const pnrNum = document.getElementById("pnr-number");
        const trainNum = document.getElementById("train-number");
        const trainName = document.getElementById("train-name");
        const originStation = document.getElementById("origin-station");
        const destinationStation = document.getElementById("destination-station");
        const boardingDate = document.getElementById("boarding-date")
        const passengerList = document.getElementById("passenger-list")

        pnrNum.textContent = resultContent.data.pnrNumber
        trainNum.textContent = resultContent.data.trainNumber
        trainName.textContent = resultContent.data.trainName
        originStation.textContent = resultContent.data.sourceStation
        destinationStation.textContent = resultContent.data.destinationStation
        boardingDate.textContent = resultContent.data.dateOfJourney

        // passenger list
        resultContent.data.passengerList.forEach(passenger => {
            let passengerLi = document.createElement("tr");
            passengerLi.innerHTML = `
                <tr>
                    <td class="border border-slate-400 py-2 px-2">Passenger ${passenger.passengerSerialNumber}</td>
                    <td class="border border-slate-400">${passenger.bookingStatusDetails}</td>
                    <td class="border border-slate-400">${passenger.currentStatusDetails}</td>
                </tr>
            `
            passengerList.appendChild(passengerLi)
        });

        // other-details
        const travelClass =  document.getElementById("class")
        const fare =  document.getElementById("fare")
        const vikalp =  document.getElementById("vikalp")
        const distance =  document.getElementById("distance")

        travelClass.textContent = resultContent.data.journeyClass
        fare.textContent = `\u20B9 ${resultContent.data.bookingFare}`
        vikalp.textContent = resultContent.data.vikalpStatus
        distance.textContent = `${resultContent.data.distance} km`


    }
})