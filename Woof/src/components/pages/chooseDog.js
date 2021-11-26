import React from 'react';

export default function ChooseDog(props) {
  function choose(index){
    props.onChosen(index)
  }
  return (
    <div className="chooseDog">
      <div className="chooseDogInner">
        <div className="chooseDogHeader">Choose Your Fomo Dog!</div>
        <div className="chooseDogFlex">
        {
          props.dogList.map((url, index) => {
            return(
              <div className="chooseDogImg">
                <img src={url} onClick={() => choose(index)}/>
              </div>
            )
          })
        }
        </div>
      </div>
    </div>
  )
}
