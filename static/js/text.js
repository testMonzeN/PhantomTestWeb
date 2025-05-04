document.addEventListener('DOMContentLoaded', function() {
    const title = document.getElementById('typing-title');
    const titleText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const titleInterval = setInterval(function() {
        if (i < titleText.length) {
            title.textContent += titleText.charAt(i);
            i++;
        } else {
            clearInterval(titleInterval);
            title.style.borderRight = 'none';
        }
    }, 100);
    
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach((element, index) => {
        const originalHTML = element.getAttribute('data-text');
        element.innerHTML = '';
        
        const delay = index * 500 + 1500;
        
        setTimeout(() => {
            let i = 0;
            let tagBuffer = '';
            let inTag = false;
            
            const typingInterval = setInterval(function() {
                if (i < originalHTML.length) {
                    const char = originalHTML.charAt(i);
                    
                    if (char === '<') {
                        inTag = true;
                        tagBuffer = char;
                        i++;
                        return;
                    }
                    
                    if (inTag) {
                        tagBuffer += char;
                        if (char === '>') {
                            element.innerHTML += tagBuffer;
                            tagBuffer = '';
                            inTag = false;
                            i++;
                        } else {
                            i++;
                        }
                        return;
                    }
                    
                    element.innerHTML += char;
                    i++;
                    
                    const isLastChar = i === originalHTML.length;
                    if (isLastChar || char === ' ' || char === ',' || char === '.') {
                        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    clearInterval(typingInterval);
                    element.style.borderRight = 'none';
                }
            }, 20);
        }, delay);
    });
});