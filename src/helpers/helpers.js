export function Element(tag, classList = [], id ='', content = '') {
    let element = document.createElement(tag);

    if (classList.length > 0) {
        element.classList.add(...classList);
    }
    
    id ? element.id = id.split(' ').join('') : null;
    
    element.textContent = content;

    return element;
};