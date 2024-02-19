const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/get-website-screenshot', async (req, res) => {
    try {
        const url = req.body.url;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.setViewport({ width: 1280, height: 800 });
        await page.waitForNavigation({ waitUntil: 'load' });
        const screenshot = await page.screenshot();
        await browser.close();

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshot.length,
        });
        res.end(screenshot, 'binary');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
