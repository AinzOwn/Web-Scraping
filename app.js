const puppeteer = require('puppeteer');
const fs = require('fs');
const cors = require('cors');

var invocation = new XMLHttpRequest();
var url = 'file:///home/dazailux/Documentos/Proyectos/Web-Scraping/index.html';
function callOtherDomain() {
  if(invocation) {
    invocation.open('GET', url, true);
    invocation.onreadystatechange = handler;
    invocation.send();
  }
}

async function run() {


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let canciones = [];

    async function getPageData(pageNumber = 1) {
        await page.goto(`https://hikarinoakariost.info/page/${pageNumber}`);
        //await page.screenshot({
        //    path: 'screeshot.png'
        //})
        const data = await page.evaluate(() => {
            const $canciones = document.querySelectorAll('.td-block-span6');
            const $pagination = document.querySelectorAll('.page-nav .last');
            const totalPages = Number($pagination[$pagination.length -1].textContent.trim());
            const data = [];
            $canciones.forEach(($cancion) => {
                data.push({
                    title: $cancion.querySelector('.entry-title').textContent.trim(),
                })
            })
            return {
                canciones: data,
                totalPages,
            }
        });
        canciones = [...canciones, ...data.canciones]
        //console.log(data);
        console.log(`page ${pageNumber} of ${data.totalPages} completed`);
        if (pageNumber <= data.totalPages - 340) {
            getPageData(pageNumber + 1)
        } else {
            fs.writeFile('data.json', JSON.stringify(canciones), () => {
                console.log('data writed');
            })
            await browser.close();
        }
    }
    getPageData();
}

run();