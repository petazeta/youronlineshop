Layouts
=======

# Introduction

Layouts facility (also known as themes) manages the templates source. It works with a folders structure that holds the templates and the css. The folder structure can hold sublayouts in a layered way, so the sublayout files would replace the parent layout but layout templates and css files not present in sublayout would be retrieved from the parent. This characteristic makes it necesary to develop a manager for the layout templates and css loadings.

## Server

Server can deliver to client this content:

- All templates (some templates can be excluded).
- A specific template.
- The css.
- A svg image file path when the svg image is included in css.

The last feature is providing a way of managing svg images includes in the layouts styles so these files could be saved at the layout folders and also would benefit of the inheredit element. 

### Testing

For testing this module we can create a server script and use the chrome devtools for inspecting results.

```
import http from 'http';
import {getTemplatesContent, getTemplate, getCssContent} from './server/themesserver.mjs';

http.createServer(app).listen(3000, ()=>console.log("app running at port: 3000"));

function app(request, response) {
  const tpscontent = getTemplatesContent("root");
  const csscontent = getCssContent("main", root");
  const catalogTp = getTemplate('catalog', 'root');
  console.log(tpscontent.length, csscontent.length, catalogTp.length);
}
```

- Note: for devtools to be connected with node we must use the option "inspect": node --inspect.

## Client




### Test



Parece que usamos aqui algo similar a Prebound methods pattern, quizá mejor hacerlo tal cual este sistema, revisar.

https://python-patterns.guide/python/prebound-methods/
