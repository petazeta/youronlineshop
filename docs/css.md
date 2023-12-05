css
===

en catalog apuntar que se añade la clase catalog al container de class page-content

    //keep height positioning
    const paginationContainer=thisElement.parentElement.parentElement.firstElementChild;
    paginationContainer.style.minHeight=paginationContainer.clientHeight + 'px';

Note:

In js we can use element.dataset to set some attribute that starts with "data-". This way we can select in css the attribute ( [data-status="archived"]) , that is more straight forward than maninpulating class list.