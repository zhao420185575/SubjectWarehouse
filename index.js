window.onhashchange = function (){
    let hash = location.hash
    switch (hash){
        case '#/home':
            document.querySelector('.main').innerHTML = '<header><a href="#/home" class="back">返回首页</a>刷题</header>'
            let temp = "<div class=\"subject-list\">\n" +
                "            <div class=\"subject\">\n" +
                "                <span class=\"subject-name\">基础知识</span>\n" +
                "                <span class=\"subject-number\">0/300</span>\n" +
                "            </div>\n" +
                "            <div class=\"subject\">\n" +
                "                <span class=\"subject-name\">专业知识</span>\n" +
                "                <span class=\"subject-number\">0/300</span>\n" +
                "            </div>\n" +
                "            <div class=\"subject\">\n" +
                "                <span class=\"subject-name\">专业实践能力</span>\n" +
                "                <span class=\"subject-number\">0/300</span>\n" +
                "            </div>\n" +
                "            <div class=\"subject\">\n" +
                "                <span class=\"subject-name\">相关专业知识</span>\n" +
                "                <span class=\"subject-number\">0/300</span>\n" +
                "            </div>\n" +
                "        </div>"
            document.querySelector('.main').innerHTML += temp
            Home()
            break
        case '#/sub1':
            loadData(hash.slice(1))
            break

        case '#/sub2':
            loadData(hash.slice(1))
            break

        case '#/sub3':
            loadData(hash.slice(1))
            break

        case '#/sub4':
            loadData(hash.slice(1))
            break
    }
}

window.onload = function (){
    Home()
}

let subjectList = {
    "/sub1": {
        "location": "./data/基础知识.json",
        "title": "基础知识",
    },
    "/sub2": {
        "location": "./data/专业知识.json",
        "title": "专业知识",
    },
    "/sub3": {
        "location": "./data/专业实践能力.json",
        "title": "专业实践能力",
    },
    "/sub4": {
        "location": "./data/相关专业知识.json",
        "title": "相关专业知识",
    },
}
let subNumber = ['/sub1','/sub2','/sub3','/sub4']
let data = []
var state = true

function loadData(route){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            data = this.responseText
            data = JSON.parse(data)
            render(location.hash.slice(2))
        }
    }
    xhr.open("GET", subjectList[route].location)
    xhr.send()
}


//渲染函数
function render(num){
    state = true
    let number = localStorage.getItem(num)
    let contentBox = document.createElement('div')
    contentBox.className = 'content'
    let question = document.createElement('span')
    question.className = 'question'
    question.innerText = `${Number(number) + 1}.${data[number].subject}`
    contentBox.appendChild(question)
    let abcde = ['a','b','c','d','e']
    for(let i = 0;i < abcde.length;i++){
        let ul = document.createElement('ul')
        if(data[number]['answer'] == abcde[i].toUpperCase()){
            ul.className = 'option'
            ul.id = 'answer'
        }else {
            ul.className = 'option'
        }
        let li = document.createElement('li')
        li.innerText = abcde[i].toUpperCase()
        let span = document.createElement('span')
        span.innerText = data[number][abcde[i]]
        ul.appendChild(li)
        ul.appendChild(span)
        contentBox.appendChild(ul)
    }
    let buttonBox = document.createElement('div')
    buttonBox.className = 'buttonBox'
    let buttonP = document.createElement('button')
    let buttonN = document.createElement('button')
    buttonP.id = 'previous'
    buttonP.innerHTML = '上一题'
    buttonBox.appendChild(buttonP)
    buttonN.id = 'next'
    buttonN.innerHTML = '下一题'
    buttonBox.appendChild(buttonN)
    contentBox.appendChild(buttonBox)
    let analysis = document.createElement('div')
    analysis.className = 'analysis'
    analysis.innerHTML += `<span>题目解析:</span>${data[number].analysis}`
    contentBox.appendChild(analysis)
    document.querySelector('.main').innerHTML = '<header><a href="#/home" class="back">返回首页</a>刷题</header>'
    document.querySelector('.main').appendChild(contentBox)
    let Lis = document.querySelectorAll('.option')
    for(let i = 0;i < Lis.length;i++){
        if(Lis[i].id == 'answer'){
            Lis[i].onclick = function (){
                if(state == true){
                    nextSub()
                }
            }
        }else{
            Lis[i].addEventListener('click', wrong)
        }
    }
    document.querySelector('#previous').addEventListener('click',previousSub)
    document.querySelector('#next').addEventListener('click',nextSub)
}

function Home(){
    let subjects = document.querySelectorAll('.subject')
    for(let i = 0;i < subjects.length;i++){
        subjects[i].onclick = function (){
            location.hash = subNumber[i]
        }
    }
    document.querySelector('.back').style.display = 'none'
    location.hash = ''
    for(let i = 0;i < 4;i++){
        if(localStorage.getItem(`sub${i+1}`) === null){
            localStorage.setItem(`sub${i+1}`,'0')
        }else {
            document.querySelectorAll('.subject-number')[i].innerText = `${localStorage.getItem(`sub${i+1}`)}/300`
        }
    }
}

function wrong(){
    if(state == true){
        this.style.background = '#930505'
        document.querySelector('#answer').style.background = '#46baff'
        document.querySelector('.analysis').style.display = 'block'
        state = false
    }
}
function previousSub(){
    let tempNumber = localStorage.getItem(location.hash.slice(2))
    if(Number(tempNumber) > 0){
        localStorage.setItem(location.hash.slice(2),Number(tempNumber)-1)
        render(location.hash.slice(2))
    }
}
function nextSub(){
    let tempNumber = localStorage.getItem(location.hash.slice(2))
    localStorage.setItem(location.hash.slice(2),Number(tempNumber)+1)
    render(location.hash.slice(2))
}
