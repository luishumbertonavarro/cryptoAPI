const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'coinmarket',
        address: 'https://coinmarketcap.com'
    },
    {
        name: 'binance',
        address: 'https://www.binance.com/es/markets'
    }
]

const articles = []

newspapers.forEach(newspaper => (
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("/currencies/")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })
        })
))

app.get('/', (req, res) => {
    res.json('Welcome to my crypto change news api')
})

app.get('/news', (req, res) => {
    res.json(articles)
})
app.listen(PORT, () => console.log(`server runing on port $(PORT)`))
