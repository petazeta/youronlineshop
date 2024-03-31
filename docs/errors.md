Error Handling
==============

# Introduction

# Sending errors from server to client

There is an error protocol understood for client for when an error is sent from server. Server errors follow this form: "{error: true, message: Error Message}", where Error Message is some text that describes the error.

/*
// quizas convendria crear una funcion para distinguir si el error viene del codigo, y quizas en ese caso salir del catch
// tambien se podria crear un Error propio, llamarlo ThrowError: if (!err instanceof ThrowError) throw err;
  .catch(err=>{
    makeReport(err);
    if (err instanceof SyntaxError || err instanceof ReferenceError || err instanceof TypeError) throw err;
  });
*/

Ahora se esta haciendo esto con la propiedad error.cause, cuando el error se genera por cuestiones propias del programa lo ponemos en valor "human", asi se distingue de errores de programación.