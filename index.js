let app = document.getElementById('app')
let header = document.getElementById('header')
let body = document.getElementById('body')
let footer = document.getElementById('footer')

let dragged;
let editorElements = []
let baseElement;
let droppableArea = `
    <div id="droppable_area" class="droppable-area">
        Drop here
    </div>
`

document.addEventListener("drag", (event) => {
    console.log("dragging");
});

document.addEventListener("dragstart", (event) => {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
    // reset the transparency
    event.target.classList.remove("dragging");
});

document.addEventListener("dragover", (event) => {
    // prevent default to allow drop
    event.preventDefault();
    // console.log('on', event.target.offsetHeight)
    event.path.map(el => {
        if (el.id==='droppable_area') {
            //
        }
        else if (el.parentNode && el.parentNode.id==='editor') {
            baseElement = document.getElementById(el.id);
            let droppableAreaDom = document.getElementById('droppable_area')
            if (droppableAreaDom) droppableAreaDom.remove()

            let position = determinePosition(event, el)
            baseElement[position](strToDom(droppableArea))
        }
    })
}, false);

document.addEventListener("dragenter", (event) => {
    if (event.target.classList.contains("dropzone")) {
        event.target.classList.add("dragover");
    }
});

document.addEventListener("dragleave", (event) => {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.classList.contains("dropzone")) {
        event.target.classList.remove("dragover");
    }
});

document.addEventListener("drop", (event) => {
    event.preventDefault();
    // move dragged element to the selected drop target
    if (event.target.classList.contains("dropzone")) {
        event.target.classList.remove("dragover");
        event.target.appendChild(dragged);
        updateEditorElements()
    }
    else {
        event.path.map(el => {
            if (el.id === 'droppable_area') {
                let droppableAreaDom = document.getElementById(el.id)
                droppableAreaDom.before(dragged)
                if (droppableAreaDom) droppableAreaDom.remove()
                updateEditorElements()
            } else if (el.parentNode && el.parentNode.id === 'editor') {
                baseElement = document.getElementById(el.id);
                let droppableAreaDom = document.getElementById('droppable_area')
                if (droppableAreaDom) droppableAreaDom.remove()
                baseElement.before(dragged)
                updateEditorElements()
            }
        })
    }
});

function updateEditorElements() {
    let components = document.getElementById('editor').children
    editorElements=[]
    for (let i=0; i<components.length; i++) {
        editorElements.push(components[i].id)
    }
    console.log(editorElements)
}

function determinePosition(event, el) {
    return event.offsetY < el.offsetHeight/2 ? 'before' : 'after'
}

function strToDom (str) {
    let parser = new DOMParser()
    return parser.parseFromString(str, 'text/html').body.firstChild
}