const createRequest = (object = {}) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', object.url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = () => {
        let document = JSON.parse(xhr.responseText);
        
        try {
            for (let key in document) {
                if (document[key].err) {
                    console.log(`Ошибка ${document[key].err}:${document[key].errMessage}`);
                    return;
                }
            }
            object.callback(document);
        } catch (err) {
            console.log(err.message)
            return
        }
    }
    
    xhr.onerror = () => {
        console.log(`${xhr.status} ${xhr.statusText}`)
    }
    xhr.send(object.params);
}