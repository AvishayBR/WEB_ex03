// Global variables for accessing DOM elements
const header = document.querySelector('h1')
const app = document.getElementById('app')
const ddMenu = document.querySelector('#ddMenu')
const sandwitch = document.querySelectorAll('svg')
const menu = document.querySelector('#menu')
const html = document.documentElement

// Function to toggle the dark mode class on the HTML element
//const toggle = () => html.classList.toggle('dark')

// Function to set the view based on the selected menu option
const setView = (v) => {
    header.innerText = v
    toggleMenu(true)

    if (v === 'Calculator') {
        renderCalculator()
    } else if (v === 'About') {
        renderAbout()
    } else if (v === 'Contact') {
        renderContact()
    }
}

// Function to toggle the visibility of the dropdown menu
const toggleMenu = (hide) => {
    if (!hide) {
        ddMenu.classList.toggle('hidden')
        document.querySelectorAll('svg').forEach((el) => {
            el.classList.toggle('hidden')
        })
    } else {
        ddMenu.classList.add('hidden')
        document.querySelectorAll('svg')[0].classList.remove('hidden')
        document.querySelectorAll('svg')[1].classList.add('hidden')
    }
}

// Function to add a row of content to a container
const addRow = (container, content) => {
    const row = `<div class='grid grid-cols-5 gap-2'>${content}</div>`
    container.insertAdjacentHTML('beforeend', row)
}

// Function to add a monitor element to a container
const addMonitor = (container, text) => {
    const t = text ?? ''
    const monitor = `<div id='monitor' class="bg-white border-4 border-blue-400 h-20 flex items-center col-span-5 text-blue-800 p-2 rounded-lg mb-2 font-bold text-4xl dark:bg-gray-800 dark:text-white dark:border-gray-600">${t}</div>`
    container.insertAdjacentHTML('beforeend', monitor)
}

// Function to create a button element with text
const button = (text) => {
    const c = text === 'calculate' ? 'col-span-4' : ''
    return `<div class='bg-blue-400 hover:bg-blue-600 text-white ${c} py-1 rounded-md text-center text-lg font-bold cursor-pointer d-btn dark:bg-gray-600 dark:hover:bg-gray-500'>${text}</div>`
}

// Function to add buttons to a container
const addButtons = (container, nums) => {
    const btnHTML = nums.map((n) => button(n)).join('')
    addRow(container, btnHTML)
}

// Event handler for button clicks
const click = (event) => {
    const monitor = document.getElementById('monitor')
    const bac = monitor.innerText.trim()
    const a = event.target.innerText
    console.log(a)
    if (a === 'clear') {
        monitor.innerText = ''
    } else if (a === 'calculate') {
        monitor.innerText = bac + '=' + eval(bac)
    } else {
        monitor.innerText += a
    }
}

// Function to render the calculator view
const renderCalculator = () => {
    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '-', '*', '/', '**', 'calculate', 'clear']
    app.innerHTML = ''
    addMonitor(app)
    addButtons(app, labels)
    const buttons = document.querySelectorAll('.d-btn')
    buttons.forEach((el) => el.addEventListener('click', click))
}

// Function to render the About view
const renderAbout = () => {
    app.innerHTML = '<div class="p-4 h-[200px] flex items-center justify-center">Temp for About</div>'
}

// Function to render the Contact view
const renderContact = () => {
    app.innerHTML = '<div class="p-4 h-[200px] flex items-center justify-center">Temp for Contact</div>'
}

// Function to render the top menu dynamically
const renderMenu = () => {
    const menuItems = ['Calculator', 'About', 'Contact']
    const menuHTML = menuItems.map(item => `<div class='menu-item cursor-pointer' onclick="setView('${item}')">${item}</div>`).join('')
    menu.innerHTML=menuHTML
    ddMenu.innerHTML = menuHTML
}

// Function to render the dark/light theme toggle buttons dynamically
const renderThemeToggle = () => {
    const toggleThemeContainer = document.getElementById('toggleTheme')

    const darkButton = document.createElement('button')
    darkButton.className = 'dark:hidden block'
    darkButton.innerText = 'Dark'
    darkButton.onclick = toggle

    const lightButton = document.createElement('button')
    lightButton.className = 'hidden dark:block'
    lightButton.innerText = 'Light'
    lightButton.onclick = toggle

    toggleThemeContainer.appendChild(darkButton)
    toggleThemeContainer.appendChild(lightButton)
}


// Initial render calls
renderMenu()
renderThemeToggle()
renderCalculator()

// ping
const origin = window.location.href
if (origin.indexOf('://localhost') === -1 && origin.indexOf('://127.0.0.1') === -1) {
    fetch(`https://api.mtw-testnet.com/app/ping?url=${encodeURIComponent(origin)}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
}

// set theme
const toggle = () => {
    document.documentElement.classList.toggle("dark")
    document.documentElement.classList.toggle("light")
    document.body.classList.toggle("dark")
    document.body.classList.toggle("light")
}

const setTheme = async (theme) => {
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
        document.documentElement.classList.add(theme)
        document.body.classList.add(theme)
    } else {
        if (!document.documentElement.classList.contains(theme)) {
            toggle()
        }
    }
}

// Listen for messages from the parent page
const sendHeightToParent = () => {
    const height = document.body.scrollHeight
    window.parent.postMessage({ type: 'myApp', action: 'setHeight', height }, '*')
}

let tempTheme = 'light'
window.addEventListener('message', (event) => {
    if (event.data === 'requestHeight') {
        sendHeightToParent()
    }
    if (event.data.action === 'setTheme') {
        setTheme(event.data.theme)
    }
    if (event.data.action === 'privateApi' && typeof acceptPrivateApiResponse !== 'undefined') {
        acceptPrivateApiResponse(event.data)
    }
})

document.addEventListener("DOMContentLoaded", function () {
    // Check if dark mode is enabled on the system
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // dark mode is enabled, update your HTML or body class
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
        console.log('dark mode is enabled')
    }
})

// send custom style to parent
if (typeof mtwAppConfig !== 'undefined' && mtwAppConfig) {
    window.parent.postMessage({ type: 'myApp', action: 'customConfig', config: mtwAppConfig }, '*')
}

// send request to parent - private API
const sendRequestToParent = (data) => {
    window.parent.postMessage({ type: 'myApp', action: 'privateApi', ...data }, '*')
}

// Call it immediately
//sendHeightToParent()
setTimeout(sendHeightToParent, 100)

// Optional: Monitor changes to the content's height
const resizeObserver = new ResizeObserver(() => {
    sendHeightToParent()
})
resizeObserver.observe(document.body)