const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const dotenv = require("dotenv");
const chalk = require("chalk");

const access = require("./access");

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.DATA_HOST_URL

const app = express();
const processLinks = links => {
  return `${links.map(link => {
  if(link.domain === "https://codingbootcamp.hosted.panopto.com"){
    link.label = `Class ${link.ts}`
  }
    return `[${link.label}](${link.url})  ${"\n"}`
  }).join('')}`
};

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/api/events", (req, res) => {
  // try getting piece,
  // TODO: Copy query string
  const url = `${BASE_URL}/api/events`;
  access.get(url).then(
    result => { 
		console.log(result.data);
		return res.json(result.data.map(t => {
      		t.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss");
      		return t;
		})) 
	}
  ).catch(
    err => res.status(500).send(err)
  );
});

app.get("/api/links", (req, res) => {
  // try getting piece,
  const url = `${BASE_URL}/api/events`;
  access.get(url).then(
    result => {
      // map each piece onto each of the links
      result.data.forEach(t => {
        t.links.forEach(l => {
          l.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss");
        })
      })
      let links = result.data.reduce((_links, t) => _links.concat(t.links) , [])
	  links = links.filter(l => l.domain == "https://codingbootcamp.hosted.panopto.com")
      res.json(links)
    }
  ).catch(
    err => res.status(500).send(err)
  );
});

app.get("/api/readme", (req, res) => {
  // try getting piece,
  const url = `${BASE_URL}/api/events`;
  access.get(url).then(
    result => {
      // map each piece onto each of the links
      result.data.forEach(t => {
        t.links.filter(l => l.domain).forEach(l => {
          l.ts = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss");
        })
      })
      let links = result.data.reduce((_links, t) => _links.concat(t.links) , [])
      links = links.filter(l => l.domain === "https://codingbootcamp.hosted.panopto.com")
      res.send(processLinks(links))
    }
  ).catch(
    err => res.status(500).send(err)
  );
});

app.get("/api/activties", (req,res)=>{
  // try getting piece,
  const url = `${BASE_URL}/api/events`;
  access.get(url).then(
    result => {
		const last = result.data.slice(result.data.length-20,result.data.length+1);
		let data = [];
		// console.log(last);
		result.data.forEach((t)=> {
			let obj = {}
			console.log(t);
			if(t.links.length > 0 && t.links[0].domain === "https://codingbootcamp.hosted.panopto.com"){
				obj.day = moment(t.ts, "X").format("MM-DD-YY HH:mm:ss");
				obj.ts = t.ts;
				obj.link = t.links[0].url;
				obj.activites = [];
				data.push(obj);
			}else if(data[data.length-1] && t.links.length > 0 && t.links[0].url.match(/https?:\/\/github.com\/the-coding-boot-camp-at-ut\/[\w-\d.]+\/blob\/master\/01-class-content/gi)){
				obj.day = moment(moment(t.ts,"X").diff(moment(data[data.length-1].ts,"X"))).format("ss");
				obj.ts = t.ts;
				obj.link = t.links[0].url;
				data[data.length-1].activites.push(obj)
			}
		})
    	res.json(data);
    }
  ).catch(
    err => res.status(500).send(err)
  );
})

app.listen(PORT, () => {
  console.log(chalk.bgBlue(`Server starting on ${PORT}`));
});
