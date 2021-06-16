let express = require('express')
let request = require('request')
let cheerio = require('cheerio')

let router = express.Router()

router.get('/', (req, res)=> {
    res.send("You've hit the home route!")
})

let kse100historic = []
let allshrhistoric = []
let kse30historic = []
let ogtihistoric = []


function compareAndPush(currentValue, historicArr) {
    if (currentValue !== historicArr[historicArr.length-1]){
        historicArr.push(currentValue)
        if(historicArr.length > 50){
            let spliced  = historicArr.splice(0,1)
            return historicArr
        }
    }
}


//rnaomd comment

router.get('/pakistanstocks', async (req, res) => {
    let stockInfo = {}
    let realRes = res
    await request('https://www.psx.com.pk/market-summary/', async (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)
        const stock = await $('div.col-xs-6 > h4')
        let kse100 = Number(stock['0'].children[0].data)
        compareAndPush(kse100, kse100historic)

        let allshr = Number(stock['1'].children[0].data)
        compareAndPush(allshr, allshrhistoric)
        
        let kse30 = Number(stock['2'].children[0].data)
        compareAndPush(kse30, kse30historic)

        let ogti = Number(stock['5'].children[0].data)
        compareAndPush(ogti, ogtihistoric)

        stockInfo= {
            kse100: {
                current: kse100,
                historic: kse100historic
            },
            allshr: {
                current: allshr,
                historic: allshrhistoric
            },
            kse30: {
                current: ogti,
                historic: ogtihistoric
            },
            ogti: {
                current: ogti,
                historic: ogtihistoric
            }
        }
        realRes.send(stockInfo)
    })
})

let dowhistoric = []
let nasdaqhistoric = []
let snp500historic = []


router.get('/usastocks', async (req, res) => {
    let realRes = res
    await request('https://www.marketwatch.com/tools/marketsummary', (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)
        
        const stock = $('div.marketdata > div.marketprice')

        let dow = Number(stock['0'].children[0].data.replace(",", ''))
        compareAndPush(dow, dowhistoric)

        let nasdaq = Number(stock['1'].children[0].data.replace(",", ''))
        compareAndPush(nasdaq, nasdaqhistoric)

        let snp500 = Number(stock['2'].children[0].data.replace(",", ''))
        compareAndPush(snp500, snp500historic)

        let stockInfo = {
            dow: {
                current: dow,
                historic: dowhistoric
            },
            nasdaq: {
                current: nasdaq,
                historic: nasdaqhistoric
            },
            snp500: {
                current: snp500,
                historic: snp500historic
            }
        }

        realRes.send(stockInfo)
    })
})

let ftse100historic = []
let ftse250historic = []
let ftse350historic = []
let ftseallshrhistoric = []

router.get('/ukstocks', async(req, res)=> {
    let realRes = res
    await request('https://shareprices.com/indices', (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)

        let ftse100 = $('body > div.wrapper-3-col-wide > div > div > div.wrapper-3-col-wide__center > div:nth-child(3) > div > table > tbody > tr:nth-child(3) > td:nth-child(2)')
        ftse100 = Number(ftse100[0].children[0].data.replace(",", ''))
        compareAndPush(ftse100, ftse100historic)

        let ftse250 = $('body > div.wrapper-3-col-wide > div > div > div.wrapper-3-col-wide__center > div:nth-child(3) > div > table > tbody > tr:nth-child(4) > td:nth-child(2)')
        ftse250 = Number(ftse250[0].children[0].data.replace(",", ''))
        compareAndPush(ftse250, ftse250historic)

        let ftse350 = $('body > div.wrapper-3-col-wide > div > div > div.wrapper-3-col-wide__center > div:nth-child(3) > div > table > tbody > tr:nth-child(5) > td:nth-child(2)')
        ftse350 = Number(ftse350[0].children[0].data.replace(",", ''))
        compareAndPush(ftse350, ftse350historic)
        //random comment

        let ftseallshr = $('body > div.wrapper-3-col-wide > div > div > div.wrapper-3-col-wide__center > div:nth-child(3) > div > table > tbody > tr:nth-child(9) > td:nth-child(2)')
        ftseallshr = Number(ftseallshr[0].children[0].data.replace(",", ''))
        compareAndPush(ftseallshr, ftseallshrhistoric)
        
        let stockInfo = {
            ftse100: {
                current: ftse100,
                historic: ftse100historic
            },
            ftse250: {
                current: ftse250,
                historic: ftse250historic
            },
            ftse350: {
                current: ftse350,
                historic: ftse350historic
            },
            ftseallshr: {
                current: ftseallshr,
                historic: ftseallshrhistoric
            }
        }
        realRes.send(stockInfo)
    })
})

let nikkei225historic = []
let asiadowhistoric = []

router.get('/japanstocks', async (req, res)=> {
    let realRes = res
    await request('https://www.marketwatch.com/investing/index/nik?countrycode=jp', (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)

        let nikkei225 = $('h3.intraday__price > bg-quote.value')
        if (nikkei225[0] === undefined){
            nikkei225 = $('h3.intraday__price > span.value')
        }
        nikkei225 = Number(nikkei225[0].children[0].data.replace(",", ''))
        compareAndPush(nikkei225, nikkei225historic)
        

        let asiadow = $('.table__cell.price > bg-quote.ignore-color')
        asiadow = Number(asiadow[0].children[0].data.replace(",", ''))
        compareAndPush(asiadow, asiadowhistoric)

        let stockInfo = {
            nikkei225: {
                current: nikkei225,
                historic: nikkei225historic
            },
            asiadow: {
                current: asiadow,
                historic: asiadowhistoric
            }
        }
        realRes.send(stockInfo)
    })
})

let indexhistoric = []

router.get('/shillerstock', async (req, res)=> {
    let realRes = res
    request('https://markets.ft.com/data/etfs/tearsheet/summary?s=UCAP:LSE:USD', (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)

        let extract = $('span.mod-ui-data-list__value')
        let index = Number(extract[0].children[0].data.replace(",", ''))
        compareAndPush(index, indexhistoric)

        let realchange
        const change = $('span.mod-format--pos')
        if (change[0].children[0].attribs.class === 'o-ft-icons-icon o-ft-icons-icon--arrow-upwards'){
            realchange = '+ ' + extract[1].children[0].children[0].next.data
        } else {
            realchange = '- ' + extract[1].children[0].children[0].next.data
        }

        let stockInfo = {
            shiller: {
                current: index,
                historic: indexhistoric,
                change: realchange
            }
        }
        realRes.send(stockInfo)

    })
})

router.get('/news', (req, res)=> {
    let realRes = res
    request('https://www.cnbc.com/finance/', (err, res, html)=> {
        const $ = cheerio.load(html)
        // console.log(html)

        const news = $('a.Card-title')
        let actualNews = []
        for(let i = 6; i< 17; i++){
            if((news[i].children[0] !== undefined)&&(news[i].attribs.href !== undefined)){
                let pushObject = {
                    title: news[i].children[0].children[0].data,
                    link: news[i].attribs.href
                }
                actualNews.push(pushObject)
            }
        }
        realRes.send(actualNews)  
    })
})


router.get('/pakistanstats', async (req, res)=> {
    let pakistats = {
        foreigndirectinvestment: {
            current: 1553.4,
            historic: [1033.8, 2392.9, 2406.6, 2780.3, 1362.4, 2561.2],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        nominalGDP: {
            current: 313.88,
            historic: [269.61, 277.54, 304.35, 284.81, 232.88, 248.13],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        realGDP: {
            current: 13122.35,
            historic: [10631.65, 11116.8, 11696.93, 12344.27, 12580.17, 12531.79],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        unemployment: {
            current: 5.00,
            historic: [6.00, 5.80, 5.70, 5.50, 4.10, 4.40],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        currentaccount: {
            current: 959,
            historic: [-2709, -4867, -12621, -19897, -13434, -2970],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        industrialsectorgrowthrate: {
            current: -2.64,
            historic: [5.18, 5.69, 4.55, 4.61, -2.27],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        inflationrate: {
            current: 11.20,
            historic: [4.50, 2.90, 4.80, 4.70, 6.80],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        interestrate: {
            current: 7.00,
            historic: [9.50, 6.50, 5.75, 6.50, 12.25, 8.00],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        tradeweightedusdollarindex: {
            current: 128.97,
            historic: [109.52, 118.19, 118.08, 119.01, 122.72],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        housingpriceindex: {
            current: 308.04,
            historic: [195.00, 214.33, 236.94, 241.49, 254.41, 263.84],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        consumerconfidence: {
            current: 40.4,
            historic: [44, 50, 50.2,46,53.5, 40.6],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        }
    }
    res.send(pakistats)
})

router.get('/usastats', (req, res) => {
    let usastats = {
        privateconsumption: {
            current: 3536
        },
        foreigndirectinvestment: {
            current: 129,
            historic: [484, 480, 315, 243, 282],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        nominalGDP: {
            current: 20934.00,
            historic: [18224.80, 18715.00, 19519.40, 20611.20, 21439.00],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        realGDP: {
            current: 21.43,
            historic: [18.22, 18.71, 19.52, 20.58],
            labels: [2015, 2016, 2017, 2018]
        },
        unemployment: {
            current: 11.1,
            historic: [5.3, 4.9, 4.4, 3.9, 3.5],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        currentaccount: {
            current: -162,
            historic: [-102, -99, -91, -112, -120, -162],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        industrialsectorgrowthrate: {
            current: -0.40,
            historic: [4.50, -4.00, 0.60, 4.00, 4.40],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        inflationrate: {
            current: 0.62,
            historic: [0.10, 1.30, 2.10, 2.40, 1.80, 0.62],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        corporateprofitgrowth: {
            current: -3.31,
            historic: [-6.75, 0.97, 7.03, 1.70, 1.83, -3.31],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        interestrate: {
            current: 0.58,
            historic: [0.77, 1.02, 1.63, 2.46, 2.75, 0.58],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        tradeweightedusdollarindex: {
            current: 118.01,
            historic: [108.17, 113.06, 112.81, 112.01, 115.74],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        housingpriceindex: {
            current: 461.57,
            historic: [357.46, 376.37, 397.30, 419.60, 439.05],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        manufacturingsectorgrowthrate: {
            current: 0.08,
            historic: [-0.77, 0.48, 0.55, -0.07, -0.85],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        consumerconfidence: {
            current: 99.6,
            historic: [109.9, 100.6, 100.3, 100.6, 101.2, 99.3],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        businessconfidenceindex: {
            current: 101.6,
            historic: [99.8, 98.9, 100.7, 101.5, 100.6, 99.1],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        }
    }
    res.send(usastats)
})


router.get('/ukstats', (req, res)=> {
    let ukstats = {
        privateconsumption: {
            current: 0,
        },
        foreigndirectinvestment: {
            current: -2000,
            historic: [3800, 2000, 2900, 900, 3900],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        nominalGDP: {
            current: 20.93,
            historic: [2.104, 2.694, 2.666, 2.861, 2.829],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        realGDP: {
            current: 472,
            historic: [444, 451, 459, 465, 472],
            labels: [2015, 2016, 2017, 2018]
        },
        unemployment: {
            current: 4.12,
            historic: [5.40, 4.90, 4.40, 4.10, 3.90],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        currentaccount: {
            current: -300,
            historic: [-2800, -3200, -1800, -1800, -3300],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        industrialsectorgrowthrate: {
            current: -2.00,
            historic: [0, 0, 4.9, 0.2, -0.9],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        inflationrate: {
            current: 0.85,
            historic: [0, 0.70, 2.70, 2.50, 1.70],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        corporateprofit: {
            current: 115000,
            historic: [102500, 107500, 110000, 115000, 11100],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        interestrate: {
            current: 0.10,
            historic: [0.50, 0.25, 0.25, 0.50, 0.75, 0.10],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        housingpriceindex: {
            current: 445,
            historic: [330,360,375,380,395,415],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        consumerconfidence: {
            current: -9,
            historic: [1, 3, -4, -9, -12],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        businessconfidenceindex: {
            current: 100.1,
            historic: [101.51, 100.3, 101.49, 101.87, 101.13, 98.95],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        }
        
    }
    res.send(ukstats)
})


router.get('/japanstats', (req, res)=> {
    let japanstats = {
        foreigndirectinvestment: {
            current: 0.079,
            historic: [1.55, 12.06, 5.00, 3.00],
            labels: [2015, 2016, 2017, 2018]
        },
        nominalGDP: {
            current: 5.082,
            historic: [4.389, 4.923, 4.867, 4.955],
            labels: [2015, 2016, 2017, 2018]
        },
        realGDP: {
            current: 528151,
            historic: [538115, 542007, 551252, 554298, 554450],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        unemployment: {
            current: 2.34,
            historic: [3.40, 3.10, 2.90, 2.40, 2.29],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        currentaccount: {
            current: 176.811,
            historic: [136.472, 197.049, 203.169,177.269],
            labels: [2015, 2016, 2017, 2018]
        },
        industrialsectorindex: {
            current: 97,
            historic: [98, 96, 9102, 101, 98],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        inflationrate: {
            current: -0.02,
            historic: [0.80, 0.10, 0.50, 1.00, 0.48],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        corporateprofitgrowth: {
            current: 17500,
            historic: [17500, 16000, 20000, 20400, 20000],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        interestrate: {
            current: -0.10,
            historic: [0.30, 0.30, -0.10, -0.10, -0.10, -0.10],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        },
        housingmarket: {
            current: 114.01,
            historic: [104.86, 107.18, 109.91, 112.03, 113.84],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        manufacturingproduction: {
            current: -0.20,
            historic: [-2.00, -4.00, 2.00, 1.00, 0, -0.2],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        consumerconfidence: {
            current: 39,
            historic: [38, 42, 42.5, 44.75, 42.5],
            labels: [2015, 2016, 2017, 2018, 2019]
        },
        businessconfidenceindex: {
            current: 99.5,
            historic: [100.8, 100.7, 100.9, 101.8, 101.4, 100.1],
            labels: [2015, 2016, 2017, 2018, 2019, 2020]
        }
    }
    res.send(japanstats)
})


module.exports = router