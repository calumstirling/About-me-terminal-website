document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    const output = document.querySelector('.output');
    const commands = ['help', 'whois', 'about', 'contact', 'projects', 'clear', 'echo', 'attributes', 'secret'];

    document.addEventListener('click', function () {
        userInput.focus();  // Focuses on the input element when any part of the website is clicked
    });

    // Loads responses
    let responsesData = {};
    fetch('responses.json')
        .then(response => response.json())
        .then(data => {
            responsesData = data;
        })
        .catch(error => console.error('Error loading responses data:', error));
        
    // Loads commands
    let commandsData = {};
    fetch('commands.json')
        .then(command => command.json())
        .then(data => {
            commandsData = data;
        })
        .catch(error => console.error('Error loading responses data:', error));

    // Highlights recognised commands.
    userInput.addEventListener('input', function () {
        const text = userInput.value.trim().toLowerCase();
        if (commands.includes(text.split(' ')[0])) {
            userInput.style.color = '#ff9900';
        } else {
            userInput.style.color = '#F5F5F5';
        }
    });

    // Handles commands on Enter key press
    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = userInput.value.trim();
            processCommand(command);
            userInput.value = '';
            userInput.style.color = '#F5F5F5'; // Resets color
        }
    });

    function processCommand(command) {
        const cmd = command.toLowerCase();
        let response;
    
        switch (cmd) {
            case 'help':
                response = generateHelpResponse();
                break;
            case 'whois':
                response = responsesData.whois || 'Command not found.';
                break;
            case 'about':
                response = responsesData.about || 'Command not found.';
                break;
            case 'contact':
                response = responsesData.contact || 'Command not found.';
                break;
            case 'projects':
                response = responsesData.projects || 'Command not found.';
                break;
            case 'echo':
                response = responsesData.echo || 'Command not found.';
                break;
            case 'attributes':
                response = responsesData.attributes || 'Command not found.';
                break;
            case 'clear':
                clearTerminal();
                return; // Skips output for clearing the terminal
            default:
                if (cmd.startsWith('echo ')) {
                    response = cmd.substring(5); // Echos back inputted text
                } else {
                    response = responsesData.commandNotFound.replace("{command}", command);
                }
        }
    
        if (response) {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('response-line');
            output.appendChild(responseDiv);
            animateTypeOut(responseDiv, response); // Typing animation
            
            const lineBreak = document.createElement('div');
            lineBreak.classList.add('line-break');
            output.appendChild(lineBreak); // Adds a line break after the response for readability
        }
    }

    function generateHelpResponse() {
        const helpData = {
            "message": "Available commands:",
            "commands": [
                "whois",
                "help",
                "about",
                "contact",
                "projects",
                "clear",
                "echo",
                "attributes",
                "secret"
            ]
        };

        let commandList = helpData.commands.map(cmd => {
            return `<div><span class="highlighted">${cmd}</span></div>`; // Each command in a new div
        }).join('');
        return `${helpData.message}<br>${commandList}`; // Adds a break to separate the message from the command list
    }

    function clearTerminal() {
        output.innerHTML = ''; // Clears the terminal
    }

    // Typing animation for text
    function animateTypeOut(element, text) {
        element.innerHTML = ''; // Clears existing text
        let i = 0;

        function type() {
            if (i < text.length) {
                let currentChar = text.charAt(i);
                if (currentChar === '<') {
                    const endTagIndex = text.indexOf('>', i);
                    if (endTagIndex !== -1) {
                        element.innerHTML += text.substring(i, endTagIndex + 1);
                        i = endTagIndex + 1;
                    }
                } else {
                    element.innerHTML += currentChar;
                    i++;
                }
                setTimeout(type, 25); // Changes the speed of typing
            }
        }

        type();
    }
});