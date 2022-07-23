const json_string = '[]'
const json_object = JSON.parse(json_string)

let policy_id = 0;
let statue_id = 0
let focus_id = 1
let division_id = 0
let devision_index;
let focusDivision_id = 1
let statue_name = ''
let newName;

let subDivisions = {}





function addPolicy () {
  policy_id = json_object.length + 1
  let single_element = '{"id":"' + policy_id + '","name":"","devisions":[]}'
  json_object.push(JSON.parse(single_element))
  console.log('Status added with id :' + policy_id)

  addStatuses(policy_id)
  console.log(json_object)
  console.log('policy ID ::' + policy_id)

}

function addStatuses(policy_id) {
    let sInput = document.createElement('input')
    sInput.type = 'text'
    sInput.id = policy_id
    sInput.placeholder = 'Add New Statue';
    sInput.style.width = '501px'
    sInput.style.padding = '8px 10px'

    let parent = document.getElementById('custom-div')
    parent.appendChild(sInput)
    console.log(sInput);

    const sInputClick = document.getElementById(sInput.id)

    //statue on click   

    sInputClick.addEventListener('click', handleClick = () => {
      console.log('statue clicked = ' + sInput.id)
      focus_id = sInput.id
      console.log('focus id =' + focus_id)
      
      let removeDiv = document.getElementById('d_remove') 
      removeDiv.remove()

      let elm = document.createElement('div')
      elm.id = 'd_remove'
      let elmParent = document.getElementById('custom-division')
      elmParent.appendChild(elm)
      displayElements()
    })

    //statue on focus out
    sInputClick.addEventListener('focusout', handleClick = () => {
      console.log('statue focused out and id = ' + focus_id)

      values = document.getElementById(focus_id).value
      console.log('values = ' + values)

      json_object[focus_id - 1]['name'].value = values

      statueChangeValue(focus_id, values)
    })

}

const statueChangeValue = (id, newName) => {
  for(let i=0; i < json_object.length; i++){
    if(json_object[i].id === id){
      json_object[i].name = newName
      console.log(newName)

      return
    }
  }
}

//DEVISIONS:

function addDivision(policy_id){
    division_id = json_object[focus_id - 1].devisions.length + 1
    console.log('devision ID : ' + division_id)

    let singleDevision = '{"name" : ""}'
    console.log('Single Devision :' + singleDevision)
    console.log(json_object)
  console.log(policy_id);
    json_object[policy_id - 1]['devisions'].push(JSON.parse(singleDevision))
    console.log('single devision added to json object')

    let devisionInput = document.createElement('input')
    devisionInput.type = 'text'
    devisionInput.id = 'division_' + division_id

    devisionInput.setAttribute('class','ny-inp')
    devisionInput.setAttribute('value', '')
    devisionInput.placeholder = 'Add SubDivision'

    let parentDiv =  document.getElementById('d_remove')
    parentDiv.appendChild(devisionInput)


    const dInputClick = document.getElementById(devisionInput.id)

    dInputClick.addEventListener('click', function handleClick () {
      console.log('devision clicked : ', devisionInput.id)

      focusDivision_id = devisionInput.id
      console.log('focusDevision ID : ' + focusDivision_id)

      devisionSplit = focusDivision_id.split("_")
      devision_index = devisionSplit[1] - 1
      console.log('devision Index = ' + devision_index)
    })

    dInputClick.addEventListener('focusout', function handleClick(){
      console.log('devision index on focusout :' + devision_index)

      newName = document.getElementById(devisionInput.id).value

      console.log('newName :' +newName)
      console.log('statue focus_id :' + focus_id)

      devisionChangeValue(focus_id, devision_index, newName)
    })
    console.log(json_object)
}


function devisionChangeValue (sID, index, newName) {
  console.log('Statue ID :' + sID)
  for(let i=0; i < json_object.length; i++){
    console.log('div loop started')

    if(json_object[i].id === sID){
      json_object[i].devisions[index].name = newName
      console.log('devision Name ADDED')
      console.log(json_object)
      return
    }
   
  }
}


//DISPLAY ELEMENTS : 

function displayElements () {

  console.log(JSON.stringify(json_object));

  for(let i=0; i < json_object.length; i++){
    oneStatue = json_object[i]
    console.log(oneStatue);
    subDivisions[oneStatue.id] = oneStatue

    console.log(subDivisions)
    console.log('devision name : ' + subDivisions[focus_id].devisions[0].name)


    let inputName = json_object[i].name
    document.getElementById((i + 1)).innerText = inputName

    console.log('Statue input value : ' + inputName)


    function divisions () {
      for(let iDiv = 0; iDiv < subDivisions[focus_id].devisions.length; iDiv++){
        iDivName = subDivisions[focus_id].devisions[iDiv].name
        console.log('Index=' + iDiv + ' and  division input name : ' + iDivName)

        let devisionInput = document.createElement('input')
        devisionInput.type = 'text'
        devisionInput.id = 'devision_' + iDiv
        devisionInput.placeholder = 'Add Sub Division'
        devisionInput.setAttribute('class', 'ny-inp')
        devisionInput.setAttribute('value', iDivName)

        let parentDiv = document.getElementById('d_remove')
        parentDiv.appendChild(devisionInput)

        const clickedInput = document.getElementById(devisionInput.id)

        clickedInput.addEventListener('click', function handleClick () {
          console.log('element clicked : ' + focus_id)

          focusDivision_id = devisionInput.id
          console.log('focused Devision id :' + focusDivision_id)

          devision_indexSplit = focusDivision_id.split('_')
          devision_index = devision_indexSplit[1] - 1
          console.log('this is devision index : ' + devision_index)
        });

        clickedInput.addEventListener('focusout' , function handleClick () {
          console.log('focusout devisionIndex : ' + devision_index)

          newName = document.getElementById(devisionInput.id).value
          console.log('newName display = ' + newName)
          console.log('focus_id' + focus_id)

          devisionChangeValue(focus_id, devision_index, newName)
          
        })

      }
      console.log(JSON.stringify(json_object));
    }
  }


  divisions()
}






function showDrop() {
    var x = document.getElementById("wel-drop");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }





//SAVE POLICIES : 

function savePolicy () {
  let files = document.getElementById('files')
  let policy_number = document.getElementById('policy_number').value
  let policy_name = document.getElementById('policy_name').value
  let program = document.getElementById('program').value
  let catagory = document.getElementById('catagory').value

  //json-object
  body_json_string = '{"statutes":' + JSON.stringify(json_object) + '}'

debugger
  //IF MISSING USER INPUT ON FORM SUBMISSION
  if (files.files == undefined || files.files.length < 1) {

    alert('Choose file')
    return
  }
  else if (policy_number == '' || policy_number == undefined) {

    alert('Provide Policy Number')
    return
  }
  else if (policy_name == '' || policy_name == undefined) {

    alert('Provide Policy Number')
    return
  }

  let formData = new FormData();

  formData.append("statue_number", policy_number)
  formData.append("statue_name", policy_name)
  formData.append("program", program)
  formData.append("catagory", catagory)

  formData.append("files", files.files[0])
  formData.append("get", body_json_string)


  //connection Backend

  let requestOptions = {
    method : 'POST',
    body : formData
  }
  console.log(formData)


  fetch("addPolicies", requestOptions).then((response) => {
    response.text();
  }).then((result) => {
    console.log(result)
    alert('Policy has been Submitted')
    window.location.href = '/addPolicies'
  }).catch((err) => {
    console.log('errro : ' + err)
  })

  alert(JSON.stringify(json_object))

}


