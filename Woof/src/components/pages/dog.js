import React, {useState, useEffect} from 'react';
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import LeaderBoard from "./leaderboard"

export default function Dog () {
  const { active, account, activate} = useWeb3React()
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState('');
  const [dogId, setDogId] = useState('Dog1');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(connect_callback, [account])

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
        const id = data[0]['token_id']
        // set Id
        setDogId(id)
        const dog = {"name":id, "count":0};
        console.log(JSON.stringify(dog))
        fetch('/add_dog', {
          method: 'POST',
          headers: { "Content-Type": "text/json"},
          body: JSON.stringify(dog)
        })

        // get count
        fetch(`/get_dog?name=${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data['count'])
          setCount(data['count'])
        })

        // get image
        fetch(`https://api.opensea.io/api/v1/assets?token_ids=${id}&asset_contract_address=0x90cfCE78f5ED32f9490fd265D16c77a8b5320Bd4`)
        .then(response => response.json())
        .then(data => setImage(data['assets'][0]['image_url']))
      })
    }
  }

  return(
    <div className="Dog">
      {active && <div id="WoofCount">{count}</div>}
      {active && <div id="WoofClick" 
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
      {!active && <button onClick={connect}>Connect to MetaMask</button>}
      {active && <div id="Connect">Connected with <b>{account}</b></div>}
      <LeaderBoard table={leaderboard}/>
    </div>
  )
}
