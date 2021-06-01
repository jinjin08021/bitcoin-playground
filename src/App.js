import React, { useState } from "react";
import ReactDOM from 'react-dom'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import $ from "jquery"

const {getWallet,getMnemonicSeedPair,seedInitialization,generateMultisigAddress} = require('./bitcore')

const copy = require('clipboard-copy')



function App() {
  const [state, setState] = useState("Select");



  const onClickCopyHandler = (e) =>{
    const value = e.target.getAttribute("value")
    copy(value)
  }

  const onClickButtonHandler = (e) => {
    setState(e.target.text)

    switch(e.target.text){
      case "Generate Bitcoin Address":
        ReactDOM.render(<BitcoinAddress/>, document.getElementById('content'));
        break
      case "Generate Multisig Address":
        ReactDOM.render(<MultisigAddress/>, document.getElementById('content'));
        break
    }

  }


  return (
    <div className="App">
      <div className = "wrapper">
        <div className="title-dropdown">
          <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic" size="lg">
              {state}
            </Dropdown.Toggle>
            <Dropdown.Menu onClick={onClickButtonHandler.bind(this,)}>
              <Dropdown.Item>Generate Bitcoin Address</Dropdown.Item>
              <Dropdown.Item>Generate Multisig Address</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div id="content">
        </div>
      </div>
    </div>
  );
}

function BitcoinAddress(props){
  const [state, setState] = useState(getMnemonicSeedPair());

  const onClickCopyHandler = (e) =>{
    const value = e.target.getAttribute("value")
    copy(value)
  }

  const onClickButtonHandler = (e) => {

    setState(getMnemonicSeedPair())

  }

  let {mnemonic,seed} = state
  let hd = seedInitialization(seed)


  return (
    <div>
      <Button variant="info" size="lg" onClick={onClickButtonHandler.bind(this,)}>
        Generate
      </Button>
        <div>
          <span className = "bold">Mnemonic</span>
        </div>
        <div className= "inline-flex">
          <Form.Control type="text" placeholder={mnemonic} readOnly className="inputContainer"/>
          <i className="fas fa-copy" value = {mnemonic} onClick ={onClickCopyHandler.bind(this)}></i>
        </div>
        <div>
          <span className = "bold">Seed</span>
        </div>
        <div className = "inline-flex">
          <Form.Control type="text" placeholder={seed} readOnly className="inputContainer"/>
          <i className="fas fa-copy" value = {seed} onClick ={onClickCopyHandler.bind(this)}></i>
        </div>
        <BitcoinHDWalletInfo hd = {hd}/>
    </div>

  )
}


function BitcoinHDWalletInfo(props){
  const {hd} = props
  const [hdIndex, setHdPath] = useState(["0","0","0"]);
  const handleHDPathChange = (value, field) => {

    copy(field)
    const [account,external,index] = hdIndex
    switch (field) {
      case "account":
        setHdPath([value,external,index])
        break;
      case "external":
        setHdPath([account,value,index])
        break
      case "HDindex":
        setHdPath([account,external,value])
        break
    }
  }

  const onClickCopyHandler = (e) =>{
    const value = e.target.getAttribute("value")
    copy(value)
  }

  let {address,pub,pri} = getWallet(hd,hdIndex)
  return(
    <div className = "bitcoinHdWallet">
      <div>
        <span className = "bold">HD Path</span>
      </div>
      <HDPath setHdPath={handleHDPathChange.bind(this,)}/>
      <div>
        <span className = "bold">Bitcoin public key (hex)</span>
      </div>
      <div className = "inline-flex">
        <Form.Control type="text" placeholder={pub} readOnly className="inputContainer"/>
        <i className="fas fa-copy" value = {pub} onClick ={onClickCopyHandler.bind(this)}></i>
      </div>
      <div>
        <span className = "bold">Bitcoin private key (WIF)</span>
      </div>
      <div className = "inline-flex">
        <Form.Control type="text" placeholder={pri} readOnly className="inputContainer"/>
        <i className="fas fa-copy" value = {pri} onClick ={onClickCopyHandler.bind(this)}></i>
      </div>
      <div>
        <span className = "bold">Bitcoin address</span>
      </div>
      <div className = "inline-flex">
        <Form.Control type="text" placeholder={address} readOnly className="inputContainer"/>
        <i className="fas fa-copy" value = {address} onClick ={onClickCopyHandler.bind(this)}></i>
      </div>
    </div>
  )
}

function HDPath(props){
  const setHdPath = props.setHdPath

  return(
    <div className = "inline-flex">
      <span>m/44'/0'/</span>
      <HDPathInput id="account" setHdPath={setHdPath.bind(this,)}/>
      <span>{"'/"}</span>
      <HDPathInput id="external" setHdPath={setHdPath.bind(this,)}/>
      <span>/</span>
      <HDPathInput id="HDindex" setHdPath={setHdPath.bind(this,)}/>
    </div>
  )

}
function HDPathInput(props){
  const {id, setHdPath} = props
  const [num, setNum] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNum(value);
    setHdPath(value,e.target.id)
  };

  return (
    <div>
      <input value={num} onChange={handleChange} className="small" id={id}/>
    </div>
  );
}






// multisig
function MultisigAddress(){
  const [state, setState] = useState("");
  const handleChange =(e)=>{}
  const onClickButtonHandler =(e)=>{
    let pubKeys = $("#pubKeys textarea").val()
    let numSig = parseInt($('#numSig').val())
    if(pubKeys && numSig && pubKeys.split('\n').length >= numSig){
      let address = generateMultisigAddress(pubKeys, numSig)
      setState(address)
    }
    else{
      alert("invalid input")
    }


  }


  return (
    <div className = "container2">
      <Form.Group controlId="exampleForm.ControlTextarea1" className ="inputLarge" id="pubKeys">
        <Form.Label>Provide public keys separated by enter.</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <span>Enter number of required signiture: </span>
      <Form.Control type="number" placeholder="" className="md" id="numSig"/>
      <div className="generate-button">
        <Button variant="info" size="lg" onClick={onClickButtonHandler.bind(this,)}>
          Generate
        </Button>
      </div>
      <div>
        Address : {state}
      </div>

    </div>
  )
}




export default App;
