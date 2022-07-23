
let myJSON = '[{"id":54,"number":"number 1","name":"any note","file_name":"happyOS_1.6.zip-1652783984419.pdf","program":"Training Career Mgmt","category":"MCT","statues":[{"name":"S1","id":88,"devisions":[{"name":"D1 of S1"},{"name":"D1 of S1"}]},{"name":"S2","id":89,"devisions":[{"name":"D1 of S2"},{"name":"D2 of S2"},{"name":"D3 of S2"}]}]},{"id":55,"number":"123a","name":"123a","file_name":"Mubusher Munsif.pdf-1652946806268.pdf","program":"Training Career Mgmt","category":"ARMHS","statues":[{"name":"1","id":90,"devisions":[{"name":"11"},{"name":"11"}]},{"name":"2","id":91,"devisions":[{"name":"12"},{"name":"22"}]}]}]'



let myfilterable = JSON.parse(myJSON);
let selectedprogram = null ;
let selectedCatagory = null;
let filterdata = [];


async function GetSelectedprogram(is_first) {

    if (is_first == 'true') {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "connect.sid=s%3ASsh-XyZx0b3K8g6njlI8zwL5lA5CuRzq.qj7QZYZGsdHu6MK9exL0cjr9Qr8TA2Qsg1p0poE%2FdIw");

        var requestOptions = {
            method: 'GET'
        };

        await fetch("loadpolicies", requestOptions)
            .then(response => response.text())
            .then(result => {

                console.log('results' + result)
                myJSON = result
                myfilterable = JSON.parse(myJSON);
                // alert(myJSON)


            })
            .catch(error => {
                console.log('error', error)
                alert('There\'s an error in fetching policies. Contact your administrator')
            });
    }

    // alert(myJSON)
    myfilterable = JSON.parse(myJSON);
    removeCreate();
    let programs = document.getElementById('programs')
    selectedprogram = programs.options[programs.selectedIndex].value
    console.log(selectedprogram, "  ", selectedCatagory);
    filterprogram(selectedprogram, selectedCatagory);
    displayfull();

}

async function loadpolicies() {

    var myHeaders = new Headers();
    myHeaders.append("Cookie", "connect.sid=s%3AdV3fDdY8vmamVIYRPQoMHOQsRHqrObtD.Gz83wWikn3AZlS1ypFNg%2FIFonICzOr5gmPlEkvOy8GE");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    await fetch("loadpolicies", requestOptions)
        .then(response => {
            //alert('first')
            myJSON = JSON.stringify(response.text())
            //console.log(response.text())
            alert(response.text())


        }

        )
        .then(result => console.log(result))
        .catch(error => console.log('error', error));



    document.getElementById('onlinejson').innerText = JSON.stringify(myJSON)


}


function GetSelectedcategory() {
    removeCreate();


    let catagory = document.getElementById('categories');
    selectedCatagory = catagory.options[catagory.selectedIndex].value;
    console.log(selectedprogram, " ", selectedCatagory);
    filterprogram(selectedprogram, selectedCatagory);
    displayfull();
}

function removeCreate() {
    let rem = document.getElementById('policies');
    rem.remove();
    console.log('remove');

    let statue = document.getElementById('statuesFront');
    statue.remove();

    let rem2 = document.createElement('div');
    rem2.id = "policies";
    console.log('created');
    let ad = document.getElementById('addp');
    ad.appendChild(rem2);
    let addstatuefront = document.createElement('div');
    addstatuefront.id = "statuesFront";
    let apedstatue = document.getElementById('addstat');
    apedstatue.appendChild(addstatuefront);
    filterdata = [];
}



//filterprogram("Training Career Mgmt" , "MCT")

function filterprogram(programas, catagory) {
    for (let i= 0; i < myfilterable.length; i++) {
        if (myfilterable[i]['program'] == programas && myfilterable[i]['catagory'] == catagory) {
            filterdata.push(myfilterable[i]);
        }

    }
    console.log(programas + "  " + catagory);
    console.log(JSON.stringify(filterdata));

}

function displayfull() { 
    const myObj = JSON.parse(JSON.stringify(filterdata));
    policies = {};
    statues = {};
    z = 0;
    let policiesCount = z < myObj.length;
    while (policiesCount) {
        policy = myObj[z];
        console.log(myObj[z])
        policies[policy.id] = policy;
        filename = myObj[z].file_name;
        policyId = myObj[z].id;
        var policyname = myObj[z].name;
        var policynumber = myObj[z].number;
        
         console.log("=====policyname========"+policyname);
         console.log("======policynumber======="+policynumber);
         
        let div1 = document.createElement("div");
        div1.className = "col-12 mt-2 bor";
        div1.id = "policyButton";
        div1.setAttribute("type", "button");

        let div2 = document.createElement("div");
        div2.className = "row justify-content-between";
        div1.appendChild(div2);

        let policy_div = document.createElement("div");
        policy_div.className = "col-4";

        div2.appendChild(policy_div);

        let button_click = document.createElement("a");
        button_click.setAttribute("type", 'button')
        button_click.id = "click_" + z


        let policy_heading = document.createElement("h5");
        policy_heading.id = policyId;
        policy_heading.className = "progress";

        policy_div.appendChild(button_click);
        button_click.appendChild(policy_heading)


        let div3 = document.createElement("div");
        div3.className = "col-2 text-center";
        div2.appendChild(div3);
        let anchor = document.createElement("a");
        anchor.setAttribute("type", 'button');


        div3.appendChild(anchor);

        
        let Dbutton = document.createElement("a");
        Dbutton.className = "btn";
       Dbutton.id = filename;
        // Dbutton.href = `/downloadPdf/${policyId}`;

        Dbutton.setAttribute("policy_id", policyId);
        Dbutton.onclick = () => {
            window.location.href = `/downloadPdf/${policyId}`
        }

        anchor.appendChild(Dbutton);

        let Dicon = document.createElement("i");
        Dicon.className = "bi bi-box-arrow-down";

        Dbutton.appendChild(Dicon);

        var element = document.getElementById("policies");
        element.appendChild(div1);

        document.getElementById(policy_heading.id).innerHTML = myObj[z].name;

        z++;



        const button = document.getElementById(button_click.id);

        button.addEventListener('click', function handleClick() {
            console.log('element clicked: ' + button_click.id);



            for (var i = 0; i < button.childNodes.length; i++) {
                var getPolicyID = button.childNodes[i].id;
            }
            function statuesDivisions() {
                maindiv = document.createElement("div");
                maindiv.id = "remove";

                for (statuCount = 0; statuCount < policies[getPolicyID].statutes.length; statuCount++) {
                    statuesNames = policies[getPolicyID].statutes[statuCount].name;
                    statuesID = policies[getPolicyID].statutes[statuCount].id;

                    acordiandiv = document.createElement("div");
                    acordiandiv.className = "accordion-item mt-4";
                    maindiv.appendChild(acordiandiv);

                    accoHead = document.createElement("h2");
                    accoHead.className = "accordion-header";
                    accoHead.id = "headingOne";
                    acordiandiv.appendChild(accoHead);

                    accobutton = document.createElement("button");
                    accobutton.className = "accordion-button";
                    accobutton.type = "button";

                    accobutton.id = "status_Heading_" + statuesID;
                    accobutton.setAttribute("data-bs-toggle", 'collapse');
                    accobutton.setAttribute("data-bs-target", '#collapseOne_'+statuCount+'');
                    accobutton.setAttribute("aria-expanded", 'true');
                    accobutton.setAttribute("aria-controls", 'collapseOne');
                    accoHead.appendChild(accobutton);

                    accoitemdiv = document.createElement("div");
                    accoitemdiv.className = "accordion-collapse collapse";
                    accoitemdiv.id = "collapseOne_"+statuCount;
                    accoitemdiv.setAttribute("aria-labelledby", 'headingOne');
                    accoitemdiv.setAttribute("data-bs-parent", '#accordionExample');
                    acordiandiv.appendChild(accoitemdiv);

                    accoitembody = document.createElement("div");
                    accoitembody.className = "accordion-body text-end mb-2";
                    accoitemdiv.appendChild(accoitembody);

                    for (divisoncount = 0; divisoncount < policies[getPolicyID].statutes[statuCount].devisions.length; divisoncount++) {
                        divisionNames = policies[getPolicyID].statutes[statuCount].devisions[divisoncount].name;
                        accoBodyInp = document.createElement("input");
                        accoBodyInp.className = "one-inp";
                        accoBodyInp.setAttribute("value", divisionNames);
                        accoitembody.appendChild(accoBodyInp);
                    }


                    statueFront = document.getElementById("statuesFront");
                    statueFront.appendChild(maindiv);
                    document.getElementById(accobutton.id).innerHTML = statuesNames;
                    console.log(acordiandiv.id);


                }
            }

            try {
                var removefun = document.getElementById("remove");
                removefun.remove();
            }catch { }
            statuesDivisions();
        });

    }
}

function showDrop() {
    var x = document.getElementById("wel-drop");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

