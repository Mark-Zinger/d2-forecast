const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const models = require('../models');

console.log(Object.keys(models));

let link = 'http://dotapicker.com/herocounter?language=ru-ru#!';



const parseTeams = async (teams) => {

    const {team,enemy} = teams;

    const Heroes = await models.Hero.findAll({
        where: { id: [...team, ...enemy] },
        attributes: ['id', 'name']
    });

    const getIncludeHiroes = (array) => {
        return array.map(el => {
            const incude = Heroes.filter(hero => parseInt(hero.dataValues.id) == el)[0].dataValues;
            if(incude.name.split(' ')[1]) { incude.name = incude.name.split(' ').join('_'); }
            return incude;
        })
    }

    const generateLink = (team, enemy) => {
        team.forEach(el => link += `/T_${el.name}`);
        enemy.forEach(el => link += `/E_${el.name}`);

    }

    const newTeam = getIncludeHiroes(team)
    const newEnemy = getIncludeHiroes(enemy)

    generateLink(newTeam, newEnemy)
 
    let browser = await puppeteer.launch({
        headless: false,
        // devtools: true,
        
    });
    page = await browser.newPage()
    await page.setViewport({ width: 1700, height: 900 });
    await page.goto(link, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('select');
    
    // await page.evaluate( async () => {
    //     const select = document.querySelector('select');
    //     const option = document.querySelectorAll('option');
    //     select.value = 'Very High';
    //     Array.from(option).forEach(el => console.log(el.value))

    //     console.log(select, option);
    // });

    await page.click('select');
    await page.waitForTimeout(5000);
    console.log('clicked');


    
    // await page.click('option');
    
    // const selector = await page.$('select')
    // console.log(selector);
    // // await selector.click({ button:'right'})

    // const option = await page.$('option');
    // console.log(option.value);
    // await option.click({ button: 'right' });

    // console.log(selector);

    // const levelSelector = await page.evaluate(async () => {
    //     const selector = document.querySelector('select');
    //     selector.click();
    //     const option = document.querySelector('option');
    //     option.click();
        

    //     console.log(selector);
    //     return true
    // })

    // console.log(levelSelectorselect);
}

parseTeams({
    team: [61,73,77,113,7],
    enemy: [27,21,83,64,105]
});
