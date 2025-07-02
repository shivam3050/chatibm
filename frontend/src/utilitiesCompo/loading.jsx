

function Loading(props) {

console.log(props)
    return (
      <div style={{
        
        width:props.size,height:props.size,
        borderWidth:`calc(${props.size} / 8)`
        }} className="resizable-loading-spinner">
         
        
      </div>
    )

}

export default Loading
