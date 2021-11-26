import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from "../wallet/connectors"
import LeaderBoard from "./leaderboard"
import ChooseDog from "./chooseDog"

export default function Dog () {
  const { active, account, activate} = useWeb3React()
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState('');
  const [dogId, setDogId] = useState('Dog1');
  const [openseaIds, setOpenseaIds] = useState([]);
  const [dogUrls, setDogUrls] = useState([]);
  const [showChooseDog, setShowChooseDog] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(connect_callback, [account])
  useEffect(chooseDog_callback, [dogUrls])

  function chooseDog_callback(){
    if (dogUrls.length > 0){
      setShowChooseDog(true) 
    }
  }

  function chosen_callback(index){
    console.log(index)
    setShowChooseDog(false) 
    setChosen(true)
    setDog(index)
  }

  function setDog(index){
    // set Id
    const id = openseaIds[index]
    setDogId(id)
    const dog = {"name":id, "count":0};
    fetch('/add_dog', {
      method: 'POST',
      headers: { "Content-Type": "text/json"},
      body: JSON.stringify(dog)
    }).then(data=>{
      // get count
      fetch(`/get_dog?name=${id}`)
      .then(response => response.json())
      .then(data => {
        setCount(data['count'])
      })
    })
    // get image
    fetch(`https://api.opensea.io/api/v1/assets?token_ids=${id}&asset_contract_address=0x90cfCE78f5ED32f9490fd265D16c77a8b5320Bd4`)
    .then(response => response.json())
    .then(data => {
      setImage(data['assets'][0]['image_url'])
    })
  }

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  function connect_callback(){
    if (typeof account !== 'undefined'){
      // get account fomo dog
      fetch(`/get_fomo_dog?address=${account}`)
      .then(response => response.json())
      .then(data => {

        // select dog
        var ids = []
        data.forEach(obj=>ids.push(obj['token_id']))
        var opensea_url = new URL('https://api.opensea.io/api/v1/assets')
        var params = {token_ids: ids, asset_contract_address: "0x90cfCE78f5ED32f9490fd265D16c77a8b5320Bd4"}
        Object.keys(params).forEach(key => {
          if (Array.isArray(params[key])) {
            params[key].forEach(p => opensea_url.searchParams.append(key, p)) 
          }
          else {
            opensea_url.searchParams.append(key, params[key])
          }
        })
        fetch(opensea_url)
        .then(response => response.json())
        .then(data => {
          var urls = []
          var ids = []
          data['assets'].forEach(obj=>{
            urls.push(obj['image_url'])
            ids.push(obj['token_id'])
          })
          setDogUrls(urls)
          setOpenseaIds(ids)
        })
      })
    }
  }

  return(
    <div className="Dog">
      {chosen && <div id="WoofCount">{count}</div>}
      {chosen && <div id="WoofClick" 
        style={{
            backgroundImage: image!==''? `url(${image})` : 'url(https://fomodog.club/static/media/fomo.c3a49b0a.png)',
        }}
        onClick={
        () => 
        {
          setCount(count+1)
          setShow(true)

          const dog = {"name": dogId, "count":1};
          fetch('/add_dog', {
            method: 'POST',
            headers: { "Content-Type": "text/json"},
            body: JSON.stringify(dog)
          })
          .then(()=>{
            fetch('/leaderboard')
            .then(response => response.json())
            .then(data => {
              setLeaderboard(data)
            })
          })
        }
      }>
        <div 
          className={show ? 'Woof' : 'Woof hide'}
          onTransitionEnd={() => {
            setShow(false)
          }
          }
        >
          Woof!
        </div>
      </div>
      }
      {!chosen && <button onClick={connect}>Connect to MetaMask</button>}
      {chosen && <div id="Connect">Connected with <b>{account}</b></div>}
      <LeaderBoard table={leaderboard}/>
      {showChooseDog && <ChooseDog dogList={dogUrls} onChosen={chosen_callback}/>}
    </div>
  )
}
