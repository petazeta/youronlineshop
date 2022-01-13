//on append any node listener
let onAppend;

function setOnAppend(onAppendListener) {
  onAppend=onAppendListener;
}

export {onAppend, setOnAppend};