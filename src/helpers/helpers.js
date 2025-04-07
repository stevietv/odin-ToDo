export function Element(tag, classList = [], id ='', content = '') {
    let element = document.createElement(tag);
    element.classList.add(...classList);
    element.id = id.split(' ').join('');
    element.textContent = content;

    return element;
};