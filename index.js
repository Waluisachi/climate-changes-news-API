const PORT = process.env.PORT || 8000;

/* NPM packages*/
const express = require("express");
const axios = require('axios');
const cheerio = require('cheerio');

/* Initialization */
const app = express();
const newspapers = [
  {
    name: "standard",
    address: "https://www.standardmedia.co.ke/topic/climate-change",
    base: ""
  },

  {
    name: "nation",
    address: "https://www.standardmedia.co.ke/topic/climate-change",
    base: ""
  },

  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk"
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: ""
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: ""
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science-environment-56837908",
    base: ""
  }
];
const articles = [];

newspapers.forEach((newspaper, i) => {
  axios.get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
          const title = $(this).text();
          const url = $(this).attr("href");
          articles.push({
            title,
            url: newspaper.base + url,
            source: newspaper.name
          });
      })
    })
});


/* Routing */
app.get("/", (req, res) => {
    res.json("Welcome to my page")
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  const specificArticle = [];

  const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId);
  // console.log(newspaper[0].base);
  axios.get(newspaper[0].address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");


      specificArticle.push({
        title,
        url: newspaper[0].base + url,
        source: newspaperId
      });

    })

    res.json(specificArticle);
  }).catch(err => console.log(err))
});

app.get("/news", (req, res) => {
      res.json(articles);
});

/* Listening server */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
