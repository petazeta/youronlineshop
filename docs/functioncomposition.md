Function Composition
====================

## Introduction

Composition is the resulting of applying some function to the function that is taked as an argument.
add=x,y=>x+y

add3= x => add(x,3)
add4= x => add(x,4)

## Application

We can use this function to add other functions:

compose = (x, f1, f2) => f2 (f1(x));

compose(2, add3, add4) // add4(add3(2)) == 9

For any number:

const pipe = (x0, ...fns) => fns.reduce(
    (acc, f) => f(acc),
    x0
)

pipe(2, add3, add4)  // add4(add3(2)) == 9

If we need to do some functions sequentially to an array of elements and use the array map method we can use this helper function :

compose = (f1, f2) => x => f2 (f1(x))

For any number:

const flow = (...fns) => x0 => fns.reduce(
    (acc, f) => f(acc),
    x0
)

flow((a)=> a * 3, (a)=>a + 3, (a)=>a * 2)(2) // == 18 : 2->6->9->18

arrayElement.map(compose(f1,f2)) // [a, b] -> [f2(f1(a)), f2(f1(b))]
arrayElement.map(flow(f1,f2,f3)) // [a, b] -> [f3(f2(f1(a))), f3(f2(f1(b)))]
