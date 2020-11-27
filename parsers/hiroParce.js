const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
var shell = require('shelljs');

const pathToSave = path.join(__dirname, '../result/heroes.json');
let link = 'https://ru.dltv.org/matches/';

const data = JSON.parse(fs.readFileSync(pathToSave, 'utf8'));

let needPushToRepo = true;

const parceDltv = async () => {

    let browser = await puppeteer.launch({
        headless: true
    });

    const parceMatch = async (matchID) => {
        try {
            let page = await browser.newPage()
                await page.setViewport({ width: 1400, height: 900 });
                await page.goto(link+matchID, { waitUntil: 'domcontentloaded' })
                await page.waitForTimeout(1000)
            const heroes = await page.evaluate( async () => {
    
                const heroesContainers = document.querySelectorAll('.pickBans .picks-item');
                
                const heroes = Array.from(heroesContainers).map((el)=>{
                    const id = el.getAttribute('data-hero');
                    const name = el.querySelector('img').title;
                    return {id, name}
                })
            
                return heroes;
            })
        
            if(heroes.length){
                heroes.forEach((el) => {
                    const include = data.filter((docEl) => docEl.id == el.id)
                    if(!include.length) {
                        data.push(el)
                        console.log('push =>', el.name);
                        needPushToRepo = true;
                    }
                })
            } else {
                await page.close();
                console.log('heroes is not found');
            }
            
            fs.writeFileSync(pathToSave, JSON.stringify(data,null, '\t'))

            if(needPushToRepo) {
                if (shell.exec('git commit -am "add hero"').code !== 0) {
                    shell.exec('git pull');
                    shell.exec('git push');
                    shell.exit(1);
                } else {
                    shell.exec('git pull');
                    shell.exec('git push');
                    shell.exit(0);
                }
            }

        } catch (e) {
            console.log('catch');
            console.log(e);
        }
    };

    const parceMatchList = async () => {
        let page = await browser.newPage()
            await page.setViewport({ width: 1400, height: 900 });
            await page.goto(link, { waitUntil: 'domcontentloaded' });
        
            const matches = await page.evaluate( async () => {
                const result = [];
                const liveContainer =  document.querySelectorAll('.event-box .live-matches-row');
                Array.from(liveContainer).forEach(el => {
                    const id = el.getAttribute('data-serie-id');
                    if(id) result.push(id);
                })
                return result;
            } )

            await page.close();


            if(matches.length) {
                for (const match of matches) {
                    await parceMatch(match)
                    console.log('Done');
                }
            } 
    }
    await parceMatchList();
    console.log('end');
    await browser.close();
}





// parceMatchList();

parceDltv();