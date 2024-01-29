```
// Generating x to y numbers using Generator

function *genXtoY(x, y){
  while(x < y)
    yield x++
  return x++      
}

const _iter = genXtoY(1, 5)

_iter.next() //{ value: 1, done: false }
_iter.next() //{ value: 2, done: false }
_iter.next() //{ value: 3, done: false }
_iter.next() //{ value: 4, done: false }
_iter.next() //{ value: 5, done: true }
_iter.next() //{ value: undefined, done: true }

// Generating x to y numbers using closure

const genXtoY = (x, y) => {
  const next = () => {
    if(x <= y)
      return {value: x++, done: (x - 1 === y)}

    return {value: undefined, done: true}
  }
  return {next}
}

const _iter = genXtoY(1, 5)

_iter.next() //{ value: 1, done: false }
_iter.next() //{ value: 2, done: false }
_iter.next() //{ value: 3, done: false }
_iter.next() //{ value: 4, done: false }
_iter.next() //{ value: 5, done: true }
_iter.next() //{ value: undefined, done: true }
```

Un buen video: [The Power of JS Generators by Anjana Vakil](https://www.youtube.com/watch?v=gu3FfmgkwUc)
Relaccionado: https://confpad.io/2018-06-01-amsterdam-jsnation-conference-2018/8-callback-heaven