

function Loading(props) {


    return (
      <div style={{
        
        width:props.size,height:props.size,
        borderWidth:`calc(${props.size} / 8)`
        }} className="resizable-loading-spinner">
         
        
      </div>
    )

}

export default Loading
