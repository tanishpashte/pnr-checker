document.addEventListener("DOMContentLoaded", () => {
    let pnrInput = document.getElementById("pnr-input")
    let pnrSubmitBtn = document.getElementById("pnr-submit-btn")
    let pnrNumber = 0
    const welcomePage = document.getElementById("welcome-container")
    const resultPage = document.getElementById("result-container")
    const errorPage = document.getElementById("error-container")

    pnrSubmitBtn.addEventListener('click', async ()=> {
        pnrNumber = pnrInput.value;
        console.log("Number submitted successfully");
        console.log(pnrNumber);
        const result = await fetchPnrStatus(pnrNumber)   
        renderResult(result)     
    })
    
    async function fetchPnrStatus(pnrNumber){
        const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnrNumber}`;
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
            
        } catch (error) {
            console.log("Error aya hai");
            
            console.error(error);
        }
    }
    
    function renderResult( resultContent){
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
        }
    }
})