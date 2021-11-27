import React from 'react';

export default function LeaderBoard (props) {
  
  return(
    <div className="LeaderBoard">
      LeaderBoard
      <table className="LeaderBoardTable">
        <tr>
          <th>Fomo Dog Id</th>
          <th>Woof!</th>
        </tr>
      {
        props.table.map(object =>{
          return(
            <tr>
              <td>{object['name']}</td>
              <td>{object['count']}</td>
            </tr>
          )
        })
      }
      </table>
    </div>
  )
}
