const express = require("express")
const bodyParser = require("body-parser")
const moment = require("moment")
const chalk = require("chalk")
const path = require("path")

const access = require("./access")

const PORT = process.env.PORT || 3001
const BASE_URL = process.env.DATA_HOST_URL

const app = express()
const processLinks = links => {
    return `${links.map(link => {
        if(link.domain === "https://codingbootcamp.hosted.panopto.com"){
            link.label = `Class ${link.ts}`
        }
        return `[${link.label}](${link.url})  ${"\n"}`
    }).join("")}`
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("client/build"))

app.get("/api/events", (req, res) => {
    // try getting piece,
    // TODO: Copy query string
    const url = `${BASE_URL}/api/events`
    access.get(url).then(
        result => {
            return res.json(result.data.map(t => {
                t.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss")
                return t
            }))
        }
    ).catch(
        err => res.status(500).send(err)
    )
})

app.get("/api/links", (req, res) => {
    // try getting piece,
    const url = `${BASE_URL}/api/events`
    access.get(url).then(
        result => {
            // map each piece onto each of the links
            result.data.forEach(t => {
                t.links.forEach(l => {
                    l.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss")
                })
            })
            let links = result.data.reduce((_links, t) => _links.concat(t.links) , [])
            links = links.filter(l => l.domain == "https://codingbootcamp.hosted.panopto.com")
            res.json(links)
        }
    ).catch(
        err => res.status(500).send(err)
    )
})

app.get("/api/readme", (req, res) => {
    // try getting piece,
    const url = `${BASE_URL}/api/events`
    access.get(url).then(
        result => {
            // map each piece onto each of the links
            result.data.forEach(t => {
                t.links.filter(l => l.domain).forEach(l => {
                    l.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss")
                })
            })
            let links = result.data.reduce((_links, t) => _links.concat(t.links) , [])
            links = links.filter(l => l.domain === "https://codingbootcamp.hosted.panopto.com")
            res.send(processLinks(links))
        }
    ).catch(
        err => res.status(500).send(err)
    )
})

app.get("/api/activities", (req,res)=>{
    // try getting piece,
    const url = `${BASE_URL}/api/events`
    access.get(url).then(
        result => {
            let data = []
            result.data.forEach((t)=> {
                let obj = {}
                if(t.links.length > 0 && t.links[0].domain === "https://codingbootcamp.hosted.panopto.com"){
                    obj.day = moment(t.ts, "X").format("LLLL")
                    obj.ts = t.ts
                    obj.link = t.links[0].url
                    obj.activites = []
                    data.push(obj)
                }else if(data[data.length-1] && t.links.length > 0 && t.links[0].url.match(/https?:\/\/github.com\/the-coding-boot-camp-at-ut\/[\w-\d.]+\/blob\/master\/01-class-content\/([\w-\d]+)\/01-activities\/([\w-\d]+)\/readme\.md/gi)){
                    obj.tsOnPanopto = +(moment(t.ts,"X")).diff(moment(data[data.length-1].ts,"X"),"seconds")
                    const regex = /https?:\/\/github.com\/the-coding-boot-camp-at-ut\/[\w-\d.]+\/blob\/master\/01-class-content\/([\w-\d]+)\/01-activities\/([\w-\d]+)\/readme\.md/gi
                    let regexArr = regex.exec(t.links[0].url)
                    obj.unit = regexArr[1]
                    obj.activityName = regexArr[2]
                    obj.ts = t.ts
                    obj.link = t.links[0].url
                    let mostRecentActivities = data[data.length-1].activites
                    //checks if theres any elements in activities if not pushes current activity
                    if(mostRecentActivities.length===0){
                        mostRecentActivities.push(obj)
                        //if there IS an activity in the array it checks each element if it has the same name
                    }else{
                        //naming loop so I can reference to break later
                        activityLoop:
                        for (let i = 0; i < mostRecentActivities.length; i++) {
                            const element = mostRecentActivities[i]
                            //if current element in the array is the same as the one we are working with it will break the loop
                            if(element.activityName===obj.activityName){
                                break activityLoop
                                //if it gets through the entire loop without breaking push activity we are working on into the array
                            }else if(i===(mostRecentActivities.length)-1){
                                mostRecentActivities.push(obj)
                            }
                        }
                    }
                }
            })
            res.json(data)
        }
    ).catch(
        (err) => {
            res.status(500).send(err)
        }
    )
})

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

app.listen(PORT, () => {
    console.log(chalk.bgBlue(`Server starting on ${PORT}`)) // eslint-disable-line no-console
})
